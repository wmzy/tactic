import Action from './action';

class Ability extends Action {
  constructor(player, game) {
    super(player, game);
    player.abilities[this.constructor.name] = this;
  }

  init() {}

  check(params) {
    return true;
  }

  async use(action) {
    // todo: 使用结算流程
  }

  destroy() {
    super.destroy();
    delete this.player[this.constructor.name];
  }
}

export default Ability;
