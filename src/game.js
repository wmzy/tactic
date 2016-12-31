// 主公-monarch;忠臣-loyal;反贼-rebel;内奸-traitor;
// 方片-diamond;红桃-herrt;黑桃-spade;梅花-club;
// 开始阶段-begin phase;判定阶段-judge phase;摸牌阶段-draw phase;出牌阶段-play phase;弃牌阶段-discard phase;结束阶段-end phase;
// 基本牌-basic card;装备牌-equipment card;锦囊牌-strategy card;身份牌-role card;武将牌-warrior card;体力牌-health card;
// 武器-weapon;防具-armor;马-horse;

import EventEmitter from 'events';
import _ from 'lodash';

import Player from './player';
import Warrior from './warrior';
import Logger from './logger';
import {
  waitEvent
} from './util';

class Game extends EventEmitter {
  constructor(users, options) {
    super();
    this.players = users.map(u => new Player(u, this));
    this.options = options;
    this.roles = ['monarch', 'loyal', 'loyal', 'rebel', 'rebel', 'rebel', 'rebel', 'traitor'];
    this.warriors = [];
    this.logger = new Logger();
  }

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

  async choiceWarriors() {
    let normalWarriors = _.shuffle(Warrior.getNormalWarriors());
    // 主公开始选将
    const normalWarriorsForMonarch = normalWarriors.slice(normalWarriors.length - 3);
    normalWarriors.length -= 3;
    this.candidateWarriorsForMonarch = Warrior.getMonarchWarriors().concat(normalWarriorsForMonarch);
    this.emit('monarchBeginChoiceWarrior');
    await waitEvent(this, 'monarchEndtChoiceWarrior');

    normalWarriors = _.shuffle(normalWarriors.concat(this.candidateWarriorsForMonarch))
    this.candidateWarriorsForLoyalAndRebel = normalWarriors.slice(normalWarriors.length - 3 * 6);
    normalWarriors.length -= 3 * 6;

    this.candidateWarriorsForTraitor = normalWarriors.slice(normalWarriors.length - 6);
    normalWarriors.length -= 6;

    this.restWarriors = normalWarriors;

    this.emit('othersBeginChoiceWarrior');
    await waitEvent(this, 'othersEndChoiceWarrior', this.players - 1);
  }

  drawCards(count) {
    const cards = this.gameCards.slice(this.gameCards.length - count);
    this.gameCards.length -= count;
    return cards;
  }

  async assignInitGameCards() {
    _.forEach(this.players, p => {p.gameCards = this.drawCards(4);});
    // 手气卡逻辑
  }

  async turnToPhase(phase, player) {
    this.emit(`game.phase.${phase}.begin`, player);
    waitEvent(this, `game.phase.${phase}.end`)
  }

  async gameLoop() {
    this.emit('gameStarted')
    let index = 0;
    while(!this.isGameOver) {
      const p = this.players[i];
      index = (index + 1) % this.players.length;
      if (p.isDied) continue;
      // todo: 反面操作
      if (p.isReversed) {
        p.isReversed = false;
        continue;
      }
      // 回合开始阶段
      this.emit('game.roundBegin', p);
      // 开始阶段-begin phase;
      await this.turnToPhase('begin', p);
      // 判定阶段-judge phase;
      await this.turnToPhase('judge', p);
      // 摸牌阶段-draw phase;
      await this.turnToPhase('draw', p);
      // 出牌阶段-play phase;
      await this.turnToPhase('play', p);
      // 弃牌阶段-discard phase;
      await this.turnToPhase('discard', p);
      // 结束阶段-end phase;
      await this.turnToPhase('end', p);
      this.emit('game.roundEnd', p);
    }
  }

  async start() {
    this.assignRoles();

    await this.choiceWarriors();

    await this.assignInitGameCards();

    this.gameLoop();
  }
}

export default Game;
