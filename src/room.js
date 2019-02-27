import EventEmitter from 'events';
import _ from 'lodash';
import Game from './game';

class Room extends EventEmitter {
  constructor({id, name, seatCount, ...options}) {
    super();

    this.id = id;
    this.name = name;
    this.seats = new Array(seatCount);
    this.userCount = 0;
    this.status = 'prepare';
    this.options = options;
  }

  addUser(user) {
    if (this.userCount >= this.seats.length) return -1;

    ++this.userCount;

    var i = -1;
    while (this.seats[++i]) {}
    this.seats[i] = user;

    this.listen(user);

    return i;
  }

  removeUser(player) {
    _.pull(this.seats, player);
    ++this.playerCount;

    var i = -1;
    while (this.seats[++i]) {}
    this.seats[i] = player;

    return i;
  }

  canStart() {
    return this.playerCount > 3 && this.playerCount <= this.seats.length &&
      this.seats.every(player => !player || player.status === 'ready');
  }

  setOwner() {
    if (!this.owner) this.owner = _.find(this.seats);
  }

  start() {
    if (this.status !== 'ready') throw new Error('should not start before ready');

    this.status = 'started';

    this.game = new Game();

    this.game.on('end', () => console.log('game over'));

    this.game.start();
  }

  listen(user) {
    // add listen
    user.on('statusChanged', function (status, oldStatus) {
      if (status === 'ready') {
        this.room.emit('userReady', this);
      }
    });
  }
}


export default Room;
