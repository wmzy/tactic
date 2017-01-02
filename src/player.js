'use strict';

import EventEmitter from 'events';
import _ from 'lodash';

import {
  wait
} from './util';

class Player extends EventEmitter {
  constructor(user, game) {
    super();
    this.user = user;
    this.game = game;
    this.listenGameEvents();
  }

  listenGameEvents() {
    this.game.once('roleAssigned', () => {
      this.game.once('monarchBeginChoiceWarrior', async() => {
        if (this.role === 'monarch') {
          await wait(15e3);
          this.choiceWarrior();
        }
      });
      this.game.once('othersBeginChoiceWarrior', async() => {
        if (this.role !== 'monarch') {
          await wait(15e3);
          this.choiceWarrior();
        }
      });
    });
  }

  choiceWarrior(i = 0) {
    if (this.warrior) return;
    if (this.role === 'monarch') {
      this.warrior = _.pullAt(this.game.candidateWarriorsForMonarch[i]);
      this.game.emit('monarchEndChoiceWarrior');
    }
    if (this.role === 'traitor') {
      this.warrior = _.pullAt(this.game.candidateWarriorsForTraitor[i]);
      this.game.restWarrior = this.game.restWarrior.concat(this.candidateWarriorsForTraitor);
      this.game.emit('othersEndChoiceWarrior');
    }
    if (_.includes(['loyal', 'rebel'], this.role)) {
      const cw = this.candidateWarriorsForLoyalAndRebel.slice(this.game.candidateWarriorsForLoyalAndRebel.length - 3);
      this.game.candidateWarriorsForLoyalAndRebel.length -= 3;
      this.warrior = _.pullAt(cw[i]);
      this.game.restWarrior = this.game.restWarrior.concat(this.cw);
      this.game.emit('othersEndChoiceWarrior');
    }
  }

  get warrior() {
    return this._warrior;
  }

  set warrior(warrior) {
    this._warrior = warrior;
    warrior.init(this.game, this);
  }
}

export default Player;
