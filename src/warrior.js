import _ from 'lodash';
class Warrior {
  static getMonarchWarriors() {
    return _.filter(Warrior.warriors, w => !!w.ability);
  }

  static getNormalWarriors() {
    return _.filter(Warrior.warriors, w => !w.ability);
  }

  constructor(name) {
    this.name = name;
  }
}

Warrior.warriors = [
  new Warrior()
]


export default Warrior;
