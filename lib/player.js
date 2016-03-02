'use strict';

const util = require('util');
const EventEmitter = require('events');
const Room = require('./room');

function Player() {
  EventEmitter.call(this);
}

util.inherits(Player, EventEmitter);

Player.prototype.createRoom = function () {
  this.room = new Room();
  this.room.addPlayer(this);
  this.room.setOwner();
};

Player.prototype.enterRoom = function (room) {
  if (!~room.addPlayer(this)) {
    this.room = room;
    return true;
  }
};

Player.prototype.ready = function () {
  this.status = 'ready';
  this.emit('statusChanged', 'ready');
};

Player.prototype.isOwner = function () {
  return this === this.room.owner;
};

Player.prototype.start = function () {
  if (this.isOwner() && this.room.canStart()) this.room.start();
};

module.exports = Player;
