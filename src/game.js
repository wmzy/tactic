// 主公-lord;忠臣-loyal;反贼-rebel;内奸-traitor;
// 方片-diamond;红桃-herrt;黑桃-spade;梅花-club;
// 开始阶段-begin phase;判定阶段-judge phase;摸牌阶段-draw phase;出牌阶段-play phase;弃牌阶段-discard phase;结束阶段-end phase;
// 基本牌-basic card;装备牌-equipment card;锦囊牌-strategy card;身份牌-role card;武将牌-warrior card;体力牌-health card;
// 武器-weapon;防具-armor;马-horse;

import EventEmitter from 'events';
import _ from 'lodash';

import Player from './player';
import Logger from './logger';
import {wait} from './util';

class Game extends EventEmitter {
  constructor(users, options) {
    super();
    this.players = users.map(u => new Player(u, this));
    this.options = options;
    this.roles = ['lord', 'loyal', 'loyal', 'rebel', 'rebel', 'rebel', 'rebel', 'traitor'];
    this.warriors = [];
    this.logger = new Logger();
  }

  assignRoles() {
    // 随机分配身份
    const roles = _.shuffle(this.roles);
    _.forEach(this.players, p => {p.role = roles.pop();});
    const li = _.findIndex(this.players, ['role', 'lord']);
    // 主公排在第一位
    this.players = _.slice(this.players, li).concat(_.slice(this.players, 0, li));
    this.emit('roleAssigned');
  }

  async choiceWarriors() {
    // 主公开始选将
    this.candidateWarriorsForLord = [];
    this.emit('lordBeginChoiceWarrior');
    await wait(15e3);
    this.emit('lordEndtChoiceWarrior');
    this.candidateWarriorsForLoyalAndRebel = [];
    this.candidateWarriorsForTraitor = [];
    this.emit('othersBeginChoiceWarrior');
    await wait(15e3);
    this.emit('othersEndChoiceWarrior');
  }

  async start() {
    this.assignRoles();

    await this.choiceWarriors();

    // todo: 分发起始手牌

    // todo: 主公准备
  }
}

export default Game;
