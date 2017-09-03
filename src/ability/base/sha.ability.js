import Ability from '../ability';
import Request from '../request';

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
    if (!this.check(params)) throw new Error('check false');
    // 将卡牌置入弃牌堆

    // 构建 request 对象
    const res = await this.game.waitResponse(
      new Request()
      .from(this.player)
      .to(params.player)
    );

    if (!res) {
      // todo: 结算
    }
  }
}

export default ShaAbility;
