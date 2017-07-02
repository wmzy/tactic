import _ from 'lodash/fp'
import {requireGlob} from '../util';

const baseAbilities = requireGlob('base/*.ability.js', __dirname)
const abilitiesMap = _.keyBy('name', baseAbilities);

export function getAbility(name) {
  return abilitiesMap[name];
}

export function getBaseAbilities() {
  return baseAbilities;
}
