import Ability from '../ability';

class TaoAbility extends Ability {
  static name = '桃';

  check(params) {
    // todo: 血量是否满
    return true;
  }

  async use(params) {
    // todo: 将卡牌置入弃牌堆

    // todo: hooks-无双/青龙刀
    this.runPostHooks();

    // todo: 结算

    // 闪抵消
    //? 仁王盾/藤甲使杀【无效】

    this.player.recover();
  }
}

export default ShaAbility;
