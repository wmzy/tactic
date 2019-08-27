import Ability from '../ability';

class ShanAbility extends Ability {
  static name = '杀';

  check(action) {
    // card 是否是闪
    // 当前玩家是否是杀的目标
    return true;
  }

  async use(params) {
    // 请求闪
    this.result = true;

    // todo: hooks-雷击
    this.runPostHooks();

    // todo: 将卡牌置入弃牌堆

    return this.result;
  }
}

export default ShanAbility;
