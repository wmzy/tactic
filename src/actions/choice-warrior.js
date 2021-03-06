import _ from 'lodash';
import Action from '../action';

class ChoiceWarriorAction extends Action {
  check(action) {
    return (
      this.player.role === 'monarch' && this.game.phase === 'monarchChoiceWarrior'
      || this.player.role !== 'monarch' && this.game.phase === 'choiceWarrior'
      ) && this.player.candidateWarriors[action.index] && !this.player.warrior;
  }

  async use(action) {
    const {candidateWarriors} = this.player;
    this.player.warrior = candidateWarriors[action.index];
    _.pullAt(candidateWarriors, action.index);
    this.game.candidateWarriors = _.shuffle(this.game.candidateWarriors.concat(candidateWarriors));
    this.player.candidateWarriors = [];

    this.destroy();
  }
}

export default ChoiceWarriorAction;
