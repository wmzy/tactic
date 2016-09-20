'use strict';

import EventEmitter from 'events';
import Room from './room';

class Player extends EventEmitter {
  createRoom() {
    this.room = new Room();
    this.room.addPlayer(this);
    this.room.setOwner();
  }

  enterRoom(room) {
    if (!~room.addPlayer(this)) {
      this.room = room;
      return true;
    }
  }

  outRoom() {
    if (this.room) {
      this.room.removePlayer(this);
      this.room = undefined;
    }
  }

  ready() {
    this.status = 'ready';
    this.emit('statusChanged', 'ready');
  }

  isOwner() {
    return this === this.room.owner;
  }

  start() {
    if (this.isOwner() && this.room.canStart()) this.room.start();
  }
}

export default Player;
