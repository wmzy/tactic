import EventEmitter from 'events';
import _ from 'lodash';

import Player from './player';
import Logger from './logger';

class Game extends EventEmitter {
  constructor(users, options) {
    super();
    this.players = users.map(u => new Player(u));
    this.options = options;
    this.logger = new Logger;
  }

  assignRole() {
    // todo: 随机分配身份
    const roles = _.shuffle([]);
  }

  start() {
    this.assignRole();

    // todo: 挑选武将

    // todo: 分发体力牌

    // todo: 分发起始手牌

    // todo: 主公准备
  }
}

export default Game;
