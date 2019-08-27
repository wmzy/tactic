import EventEmitter from 'events';
import Promise from 'bluebird';
import _ from 'lodash';

import Player from './player';
import Warrior from './warrior';
import Request from './request';
import {generateAbility} from './ability/abiliity';
import {cutArray} from './util';

class Game extends EventEmitter {
  constructor(users, options) {
    super();
    this.players = users.map(u => new Player(u, this));
    this.options = options;
    this.roles = ['monarch', 'loyal', 'loyal', 'rebel', 'rebel', 'rebel', 'rebel', 'traitor'];
    this.warriors = [];
    this.cards = [];
    this.wasteCards = [];
    this.state = 'init';
    this.currentPlayerIndex = 0;
    this.phase = 'init';
    this.currentActions = [];

    // hooks
    this.preRoundHooks = [];
    this.postRoundHooks = [];

    this.prePreparePhaseHooks = [];
    this.postPreparePhaseHooks = [];
    this.preJudgePhaseHooks = [];
    this.postJudgePhaseHooks = [];
    this.preDrawPhaseHooks = [];
    this.postDrawPhaseHooks = [];
    this.prePlayPhaseHooks = [];
    this.postPlayPhaseHooks = [];
    this.preDiscardPhaseHooks = [];
    this.postDiscardPhaseHooks = [];
    this.endPhaseHooks = [];
  }

  /**
   * 分配角色
   */
  assignRoles() {
    // 随机分配身份
    const roles = _.shuffle(this.roles);
    _.forEach(this.players, p => {
      p.role = roles.pop();
    });
    // 主公排在第一位
    const li = _.findIndex(this.players, ['role', 'monarch']);
    this.players = _.slice(this.players, li).concat(_.slice(this.players, 0, li));
    _.forEach(this.players, (p, i) => {p.seatIndex = i;});
    this.emit('roleAssigned');
  }

  /**
   * 选择武将
   * @returns {Promise.<void>}
   */
  async choiceWarrior() {
    this.restWarriors = _.shuffle(Warrior.getNormalWarriors());
    // 主公开始选将
    // 主公可选武将包含两个普通武将
    const normalWarriorsForMonarch = cutArray(this.restWarriors, 2);
    this.candidateWarriorsForMonarch = Warrior.getMonarchWarriors().concat(normalWarriorsForMonarch);
    const index = await this.request(
      new Request('game.monarchChoiceWarrior')
        .to(this.players[0], {warriors: this.candidateWarriorsForMonarch})
    );
    this.players[0].warrior = this.candidateWarriorsForMonarch[index];
    _.pullAt(this.candidateWarriorsForMonarch, index);
    this.restWarriors = _.shuffle(this.restWarriors.concat(this.candidateWarriorsForMonarch));

    const req = new Request('game.choiceWarrior');
    this.players.slice(1).forEach(player =>
      req.to(player, {warriors: cutArray(this.restWarriors, player.role === 'traitor' ? 6 : 3)})
    );
    const indexes = await this.waitAllResponse(req);
    _.forEach(req.toPlayers, (to, i) => {
      to.player[0].warrior = to.payload.warriors[indexes[i]];
      _.pullAt(to.payload.warriors, indexes[i]);
      this.restWarriors = this.restWarriors.concat(to.payload.warriors);
    });
  }

  resetGameCards() {
    // todo: 洗牌
  }

  drawCards(count) {
    if (count > this.gameCards.length) this.resetGameCards();
    return cutArray(this.gameCards, count);
  }

  async assignInitGameCards() {
    _.forEach(this.players, p => {p.gameCards = this.drawCards(4);});
    // 手气卡逻辑
  }

  async applyHooks(hooks) {
    await Promise.mapSeries(hooks, h => h(this));
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get indexOfNextPlayer() {
    // todo
  }

  async turnToRound() {
    const player = this.currentPlayer;
    // todo: 反面操作
    if (player.isReversed) {
      player.isReversed = false;
      this.currentPlayerIndex = this.indexOfNextPlayer;
      await this.turnToRound();
      return;
    }

    // 回合开始阶段
    this.emit('round.start');
    await this.applyHooks(this.preRoundHooks);

    // 准备阶段-prepare phase;
    this.emit('round.prepare');
    await this.applyHooks(this.prePreparePhaseHooks);
    await this.applyHooks(this.postPreparePhaseHooks);

    // 判定阶段-judge phase;
    this.emit('round.judge');
    await this.applyHooks(this.preJudgePhaseHooks);
    await this.judgePhase();
    await this.applyHooks(this.postJudgePhaseHooks);

    // 摸牌阶段-draw phase;
    this.emit('round.draw');
    await this.applyHooks(this.preDrawPhaseHooks);
    await this.drawPhase();
    await this.applyHooks(this.postDrawPhaseHooks);

    // 出牌阶段-play phase;
    this.emit('round.play');
    await this.applyHooks(this.prePlayPhaseHooks);
    await this.playPhase();
    await this.applyHooks(this.postPlayPhaseHooks);

    // 弃牌阶段-discard phase;
    this.emit('round.discard');
    await this.applyHooks(this.preDiscardPhaseHooks);
    await this.discardPhase();
    await this.applyHooks(this.postDiscardPhaseHooks);

    // 结束阶段-end phase;
    this.emit('round.end');
    await this.applyHooks(this.endPhaseHooks);

    this.emit('game.roundEnd', player);
    await this.applyHooks(this.postRoundHooks);
  }

  async playPhase() {
    const action = await this.waitPlayerAction();
    if (!action) return;
    await this.applyAction(action);
    await this.playPhase();
  }

  waitPlayerAction() {
    this.emit('waitPlayerAction');
    return new Promise(res => {
      this.on('action', res);
      setTimeout(res, this.options.waitSeconds);
    });
  }

  action(action) {
    // 空的 action 视为放弃
    if (this.validateAction(action)) this.emit('action', action);
  }

  validateAction(action) {
    // 空的 action 视为放弃
    if (!action) return true;

    const player = this.players[action.playerIndex];
    if (!player || player.isDied) return false;

    const playerAction = player.actions[action.name];
    if (!playerAction) return false;

    if (!playerAction.check) return true;
    return playerAction.check(action);
  }

  async applyAction(action) {
    const player = this.players[action.playerIndex];
    this.currentActions.push(action);
    const result = await player.actions[action.name].use(action);
    this.currentActions.pop();
    return result;
  }

  get currentAction () {
    return _.last(this.currentActions);
  }

  get isOver() {
    return this.state === 'over';
  }

  async start() {
    this.assignRoles();

    await this.choiceWarrior();

    await this.assignInitGameCards();

    this.emit('game.start');
    await this.turnToRound();
  }

  over() {
    this.state = 'over';
    return new Promise(() => {});
  }
}

export default Game;
