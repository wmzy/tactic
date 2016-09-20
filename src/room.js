'use strict';

import EventEmitter from 'events';
import _ from 'lodash';
import Game from './game';

class Room extends EventEmitter {
  constructor(name, seatCount, options) {
    super();

    this.name = name;
    this.seats = new Array(seatCount);
    this.playerCount = 0;
    this.status = 'prepare';
    this.options = options;
  }

  addPlayer(player) {
    if (this.playerCount >= this.seats.length) return -1;

    ++this.playerCount;

    var i = -1;
    while (this.seats[++i]) {
    }
    this.seats[i] = player;

    _listen_to_player(player);

    return i;
  }

  removePlayer(player) {
    _.pull(this.seats, player);
    ++this.playerCount;

    var i = -1;
    while (this.seats[++i]) {
    }
    this.seats[i] = player;

    _listen_to_player(player);

    return i;
  }

  canStart() {
    return this.playerCount > 3 && this.playerCount <= this.seats.length
      && this.seats.every(player => !player || player.status === 'ready');
  }

  setOwner() {
    if (!this.owner) this.owner = _.find(this.seats);
  }

  start() {
    if (this.status !== 'ready') throw new Error('should not start before ready');

    this.status = 'started';

    this.game = new Game();

    // todo: 随机分配身份

    // todo: 挑选武将

    // todo: 分发体力牌

    // todo: 分发起始手牌

    // todo: 主公准备
  }
}


function _listen_to_player(player) {
  // add listen
  player.on('statusChanged', function (status, oldStatus) {
    if (status === 'ready') {
      this.room.emit('playerReady', this);
    }
  });
}

export default Room;
