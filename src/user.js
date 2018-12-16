import EventEmitter from 'events';
import Room from './room';

class User extends EventEmitter {
  constructor(username, connection) {
    super();
    this.username = username;
    this.connection = connection;
    this.connection.on('message', this.handleMessage.bind(this));
  }

  handleMessage({type, payload}) {
    if (type === 'response') this.emit('response', payload);
  }

  handleRequest(payload) {
    this.connection.send(payload);
  }

  createRoom() {
    this.room = new Room();
    this.room.addUser(this);
    this.room.setOwner();
  }

  enterRoom(room) {
    if (!~room.addUser(this)) {
      this.room = room;
      return true;
    }
  }

  outRoom() {
    if (this.room) {
      this.room.removeUser(this);
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

export default User;
