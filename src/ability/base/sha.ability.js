import Ability from '../abiliity';

class ShaAbility extends Ability {
  static name = '杀';

  check(params) {
    return true;
  }

  async use(params) {
  }
}

export default ShaAbility;
