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

  var i = -1;
  while (this.seats[++i]) {}
  this.seats[i] = player;

  return i;
};

Room.prototype.setOwner = function () {
  if (!this.owner) this.owner = _.find(this.seats);
};

Room.prototype.start = function () {
  if (this.status !== 'ready') throw new Error('should not start before ready');

  this.status = 'started';

  this.game = new Game();
};

module.exports = Room;
