class Ability {
  constructor(player, game) {
    this.player = player;
    this.game = game;
    this.init();
  }

  init() {}

  check(params) {
    return true;
  }

  checkResponse(params) {
    return true;
  }

  async use(params) {
    // todo: 使用结算流程
  }
}

export default Ability;
