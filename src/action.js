class Action {
  constructor(player, game) {
    this.player = player;
    this.game = game;
    this.init();
    player.actions[this.constructor.name] = this;
  }

  init() {}

  check(params) {
    return true;
  }

  async use(action) {
    // todo: 使用结算流程
  }

  destroy() {
    delete this.player.actions[this.constructor.name];
  }
}

export default Action;
