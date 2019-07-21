import _ from 'lodash/fp';
import {requireGlob} from '../util';

const cardAbilities = requireGlob('card/*.ability.js', __dirname);
const abilitiesMap = _.keyBy('name', cardAbilities);

export function getAbility(name) {
  return abilitiesMap[name];
}

export function getCardAbilities() {
  return cardAbilities;
}
