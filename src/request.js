import _ from 'lodash';

class Request {
  constructor(key, payload) {
    this.id = _.uniqueId();

    this.key = key;
    this.payload = payload;
    this.toPlayers = [];
  }

  from(player) {
    this.fromPlayer = player;
    return this;
  }

  to(player, payload) {
    this.toPlayers.push({players: _.castArray(player), payload});
    return this;
  }
}

export default Request;
