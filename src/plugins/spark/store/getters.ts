import { read } from '@/helpers/dynamic-store';
import { RootStore } from '@/store/state';
import { serviceById } from '@/store/services/getters';
import { SparkState } from './state';
import { Spark, Block, UserUnits, UnitAlternatives, CompatibleBlocks } from '../state';

const defaultProfileNames = [
  'Profile1',
  'Profile2',
  'Profile3',
  'Profile4',
  'Profile5',
  'Profile6',
  'Profile7',
  'Profile8',
];

export const typeName: string = 'Spark';

const getters = {
  blocks: (state: SparkState): { [id: string]: Block } => state.blocks,
  blockIds: (state: SparkState): string[] => Object.keys(state.blocks),
  blockValues: (state: SparkState): Block[] => Object.values(state.blocks),
  units: (state: SparkState): UserUnits => state.units,
  unitAlternatives: (state: SparkState): UnitAlternatives => state.unitAlternatives,
  compatibleBlocks: (state: SparkState): CompatibleBlocks => state.compatibleBlocks,
  discoveredBlocks: (state: SparkState): string[] => state.discoveredBlocks,
};

export default getters;

export const blocks = read(getters.blocks);
export const blockIds = read(getters.blockIds);
export const blockValues = read(getters.blockValues);
export const units = read(getters.units);
export const unitAlternatives = read(getters.unitAlternatives);
export const compatibleBlocks = read(getters.compatibleBlocks);
export const discoveredBlocks = read(getters.discoveredBlocks);

export function blockById<T extends Block>(
  store: RootStore,
  serviceId: string,
  id: string,
  type?: string,
): T {
  const block = blocks(store, serviceId)[id];
  if (!block) {
    throw new Error(`Block ${id} not found in service ${serviceId}`);
  }
  if (block && type && block.type !== type) {
    throw new Error(`Invalid block ${id}: ${block.type} !== ${type}`);
  }
  return block as T;
}

export function allBlocks<T extends Block>(
  store: RootStore,
  serviceId: string,
  type?: string,
): T[] {
  return blockValues(store, serviceId)
    .filter(block => !type || block.type === type) as T[];
}

export const sparkServiceById = (store: RootStore, id: string) =>
  serviceById<Spark>(store, id, typeName);

export const sparkConfigById = (store: RootStore, id: string) =>
  sparkServiceById(store, id).config || {};

export const profileNames = (store: RootStore, id: string) => {
  const configNames = sparkConfigById(store, id).profileNames || [];
  return [
    ...configNames.slice(0, defaultProfileNames.length),
    ...defaultProfileNames.slice(configNames.length),
  ];
};
