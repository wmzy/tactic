import Ability from '../ability';

class ShaAbility extends Ability {
  static name = '杀';

  check(params) {
    // todo: 卡牌是否是 ‘杀’ 或者被当作‘杀’
    // todo: 是否超过杀的上限
    // todo: 距离
    // todo: 目标是否可以成为杀的目标
    return true;
  }

  async use(params) {
    // todo: 将卡牌置入弃牌堆

    // 请求闪
    const res = await this.game.waitPlayerAction();

    // todo: hooks-无双/青龙刀
    this.runPostHooks();

    // todo: 结算

    // 闪抵消
    //? 仁王盾/藤甲使杀【无效】

    if (!res) {
      // 造成伤害
      this.game.hurt({
        from: this.player,
        target: params.player,
        points: this.getPoints(),
        type: params.card.type
      });
    }

  }
}

export default ShaAbility;
