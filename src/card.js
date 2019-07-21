import _ from 'lodash';

class Card {
  constructor(name, type, suit, number, description = '') {
    this.name = name;
    this.type = type;
    this.suit = suit;
    this.number = number;
    this.description = description;
  }
}

function copy(obj, n) {
  return _.fill(new Array(n), obj);
}

Card.allCards = [
  new Card('杀', 'basic', 'spade', '7'),
  ...copy(new Card('杀', 'basic', 'spade', '8'), 2),
  ...copy(new Card('杀', 'basic', 'spade', '9'), 2),
  ...copy(new Card('杀', 'basic', 'spade', '10'), 2),
  ...copy(new Card('杀', 'basic', 'herrt', '10'), 2),
  new Card('杀', 'basic', 'herrt', 'J'),
  new Card('杀', 'basic', 'club', '2'),
  new Card('杀', 'basic', 'club', '3'),
  new Card('杀', 'basic', 'club', '4'),
  new Card('杀', 'basic', 'club', '5'),
  new Card('杀', 'basic', 'club', '6'),
  new Card('杀', 'basic', 'club', '7'),
  ...copy(new Card('杀', 'basic', 'club', '8'), 2),
  ...copy(new Card('杀', 'basic', 'club', '9'), 2),
  ...copy(new Card('杀', 'basic', 'club', '10'), 2),
  ...copy(new Card('杀', 'basic', 'club', 'J'), 2),
  new Card('杀', 'basic', 'diamond', '6'),
  new Card('杀', 'basic', 'diamond', '7'),
  new Card('杀', 'basic', 'diamond', '8'),
  new Card('杀', 'basic', 'diamond', '9'),
  new Card('杀', 'basic', 'diamond', '10'),
  new Card('杀', 'basic', 'diamond', 'K'),
];

export default Card;
