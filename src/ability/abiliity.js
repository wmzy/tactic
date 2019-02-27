class Ability {
  constructor(player, game) {
    this.player = player;
    this.game = game;
  }

  check(params) {
    return true;
  }

  async use(params) {
    // todo: 使用结算流程
  }
}

export default Ability;
