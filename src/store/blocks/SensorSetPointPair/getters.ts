import { allBlockFromService, blockById } from '../getters';

import { SensorSetPointPairBlock } from './SensorSetPointPair';

import { RootStore } from '../../state';

export function getById(store: RootStore, id: string): SensorSetPointPairBlock {
  const block = blockById(store, id);

  // force block type
  if (!block || block.type !== 'SensorSetPointPair') {
    throw new Error(`Invalid block: ${block.type} !== SensorSetPointPair`);
  }

  return block as SensorSetPointPairBlock;
}

export function getAll(store: RootStore, serviceId: string): SensorSetPointPairBlock[] {
  return allBlockFromService(store, serviceId)
    .filter(block => block.type === 'SensorSetPointPair') as SensorSetPointPairBlock[];
}
