'use strict';

import EventEmitter from 'events';
import Promise from 'bluebird';
import _ from 'lodash';

import {cutArray, wait} from './util';

class Player extends EventEmitter {
  constructor(user, game) {
    super();
    this.user = user;
    this.game = game;
    this.listenGameEvents();
    this.cards = [];
    this.judgeStack = [];
    this.abilities = {};

    this.data = {};
    this.turnData = {};

    this.hourglass = null;
    this.user.on('response', this.response.bind(this));
  }

  useAbility(name, params) {
    return this.abilities[name].use(params);
  }

  request(payload) {
    this.user.handleRequest(payload);
  }

  response(payload) {
    // todo:
  }

  listenGameEvents() {
    this.game.once('roleAssigned', () => {
    });

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

    this.game.on('game.phase.judge.begin', async() => {
      await Promise.mapSeries(_.resolve(this.judgeStack), j => {
        return this.game.judge(j);
      });
      this.game.emit('game.phase.judge.end')
    });

    this.game.on('game.phase.draw.begin', this.drawCards);
  }

  drawCards() {
    const cards = this.game.drawCards(2);
    this.cards = this.cards.concat(cards);
  };

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
      const cw = cutArray(this.candidateWarriorsForLoyalAndRebel, 3);
      this.warrior = _.pullAt(cw[i]);
      this.game.restWarrior = this.game.restWarrior.concat(cw);
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
