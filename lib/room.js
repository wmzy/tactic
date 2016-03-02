'use strict';

const util = require('util');
const EventEmitter = require('events');
const _ = require('lodash');
const Game = require('./game');

function Room(name, seatCount, options) {
  EventEmitter.call(this);

  this.name = name;
  this.seats = new Array(seatCount);
  this.playerCount = 0;
  this.status = 'prepare';
  this.options = options;
}

util.inherits(Room, EventEmitter);

Room.prototype.addPlayer = function (player) {
  if (this.playerCount >= this.seats.length) return -1;

  ++this.playerCount;

  var i = -1;
  while (this.seats[++i]) {}
  this.seats[i] = player;

  _listen_to_player(player);

  return i;
};

function _listen_to_player(player) {
  // add listen
  player.on('statusChanged', function (status, oldStatus) {
    if (status === 'ready') {
      this.room.emit('playerReady', this);
    }
  });
}

Room.prototype.canStart = function () {
  return this.playerCount > 3 && this.playerCount <= this.seats.length
    && this.seats.every(player => !player || player.status === 'ready');
};

Room.prototype.setOwner = function () {
  if (!this.owner) this.owner = _.find(this.seats);
};

Room.prototype.start = function () {
  if (this.status !== 'ready') throw new Error('should not start before ready');

  this.status = 'started';

  this.game = new Game();

  // todo: 随机分配身份

  // todo: 挑选武将

  // todo: 分发体力牌

  // todo: 分发起始手牌

  // todo: 主公准备
};

module.exports = Room;
