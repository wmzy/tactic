import EventEmitter from 'events';
import Promise from 'bluebird';
import _ from 'lodash';

import Player from './player';
import Warrior from './warrior';
import Request from './request';
import {generateAbility} from './ability/abiliity';
import {
  cutArray,
  waitEvent
} from './util';

class Game extends EventEmitter {
  constructor(users, options) {
    super();
    this.players = users.map(u => new Player(u, this));
    this.options = options;
    this.roles = ['monarch', 'loyal', 'loyal', 'rebel', 'rebel', 'rebel', 'rebel', 'traitor'];
    this.warriors = [];
    this.state = 'init';
    this.phase = 'init';
    this.requests = [];

    // hooks
    this.preRoundHooks = [];
    this.postRoundHooks = [];

    this.preJudgePhaseHooks = [];
    this.postJudgePhaseHooks = [];
    this.preDrawPhaseHooks = [];
    this.postDrawPhaseHooks = [];
    this.prePlayPhaseHooks = [];
    this.postPlayPhaseHooks = [];
    this.preDiscardPhaseHooks = [];
    this.postDiscardPhaseHooks = [];
    this.endPhaseHooks = [];

    this.hourglass = null;
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
    const normalWarriorsForMonarch = cutArray(this.restWarriors, 2);
    this.candidateWarriorsForMonarch = Warrior.getMonarchWarriors().concat(normalWarriorsForMonarch);
    const index = await this.waitResponse(
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

  async turnToPhase(phase, player) {
    this.phase = phase;
    this.emit(`game.phase.${phase}.begin`, player);
    await waitEvent(this, `game.phase.${phase}.end`);
  }

  async applyHooks(hooks) {
    await Promise.mapSeries(hooks, h => h(this));
  }

  async turnToRound(player) {
    if (player.isDied) return;
    // todo: 反面操作
    if (player.isReversed) {
      player.isReversed = false;
      return;
    }

    this.roundPlayer = player;
    // 回合开始阶段
    this.emit('game.roundBegin', player);
    await this.applyHooks(this.preRoundHooks);

    // 开始阶段-begin phase;
    await this.turnToPhase('begin', player);
    // 判定阶段-judge phase;
    await this.turnToPhase('judge', player);
    // 摸牌阶段-draw phase;
    await this.turnToPhase('draw', player);
    // 出牌阶段-play phase;
    await this.turnToPhase('play', player);
    // 弃牌阶段-discard phase;
    await this.turnToPhase('discard', player);
    // 结束阶段-end phase;
    await this.turnToPhase('end', player);

    this.emit('game.roundEnd', player);
    await this.applyHooks(this.postRoundHooks);
  }

  get isGameOver() {
    return this.state === 'over';
  }

  async gameLoop() {
    this.emit('gameStarted');
    let index = 0;
    while(!this.isGameOver) {
      await this.turnToRound(this.players[i]);
      index = (index + 1) % this.players.length;
    }
  }

  async start() {
    this.assignRoles();

    await this.choiceWarrior();

    await this.assignInitGameCards();

    await this.gameLoop();
  }

  async judge(j) {
    this.applyHooks(this.preJudgeHooks);
    await j.apply();
    this.applyHooks(this.postJudgeHooks);
  }

  async response(payload) {
    const req = _.last(this.requests);
    if (!req) throw new Error('no request');
    if (payload.requestId !== req.id) throw new Error('request id not match');
    if (!req.isRequestPlayer(payload.player)) throw new Error('is not request player');

    // todo: hooks
    // await payload.player.useAbility(payload.ability, payload.abilityParams);
    this.emit('response:' + requestId, payload);
  }

  // 等待玩家响应
  async waitResponse(request) {
    this.requests.push(request);
    // notify request.toPlayers
    this.emit('request', request);
    return new Promise(resolve => {
      this.once('response:' + request.id, res => {
        this.hourglass.clear();
        resolve(res);
      });
      this.hourglass.timeout(() => {
        this.emit('response:' + request.id, null);
      });
    })
  }
}

export default Game;
