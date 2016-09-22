'use strict';

import EventEmitter from 'events';

class Game extends EventEmitter {
  constructor(players, options) {
    super();
    this.seats = players;
    this.options = options;
  }

  start() {
    // todo: 随机分配身份

    // todo: 挑选武将

    // todo: 分发体力牌

    // todo: 分发起始手牌

    // todo: 主公准备
  }
}

export default Game;
