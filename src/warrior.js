import _ from 'lodash';

class Warrior {
  static getMonarchWarriors() {
    return _.filter(Warrior.warriors, w => !!w.ability);
  }

  static getNormalWarriors() {
    return _.filter(Warrior.warriors, w => !w.ability);
  }

  constructor(name, faction, gender, healthPoint, extraAbilities, description = '') {
    this.name = name;
    this.faction = faction;
    this.gender = gender;
    this.healthPoint = healthPoint;
    this.extraAbilities = extraAbilities;
    this.description = description;
  }

  get isMonarch() {
    return _.some(this.abilities, ['type', 'monarch']);
  }
}

Warrior.warriors = [
  new Warrior('曹操', '魏', 'M', 4, ['护驾', '奸雄']),
  new Warrior('司马懿', '魏', 'M', 3, ['反馈', '鬼才']),
  new Warrior('夏侯惇', '魏', 'M', 4, ['刚烈']),
  new Warrior('张辽', '魏', 'M', 4, ['突袭']),
  new Warrior('许褚', '魏', 'M', 4, ['裸衣']),
  new Warrior('郭嘉', '魏', 'M', 3, ['天妒', '遗计']),
  new Warrior('甄姬', '魏', 'F', 3, ['倾国', '洛神']),

  new Warrior('刘备', '蜀', 'M', 4, ['激将', '仁德']),
  new Warrior('关羽', '蜀', 'M', 4, ['武圣']),
  new Warrior('张飞', '蜀', 'M', 4, ['咆哮']),
  new Warrior('诸葛亮', '蜀', 'M', 3, ['观星', '空城']),
  new Warrior('赵云', '蜀', 'M', 4, ['龙胆']),
  new Warrior('马超', '蜀', 'M', 4, ['马术', '铁骑']),

  new Warrior('孙权', '吴', 'M', 4, ['救援', '制衡']),
  new Warrior('甘宁', '吴', 'M', 4, ['奇袭']),
  new Warrior('吕蒙', '吴', 'M', 4, ['克己']),
  new Warrior('黄盖', '吴', 'M', 4, ['苦肉']),
  new Warrior('周瑜', '吴', 'M', 3, ['英姿', '反间']),
  new Warrior('大乔', '吴', 'F', 3, ['国色', '流离']),
  new Warrior('陆逊', '吴', 'M', 3, ['谦逊', '连营']),
  new Warrior('孙尚香', '吴', 'F', 3, ['结姻', '枭姬']),

  new Warrior('华佗', '群', 'M', 3, ['急救', '青囊']),
  new Warrior('吕布', '群', 'M', 4, ['无双']),
  new Warrior('貂蝉', '群', 'F', 3, ['离间', '闭月']),
  new Warrior('袁术', '群', 'M', 4, ['妄尊', '同疾'])
];


export default Warrior;
