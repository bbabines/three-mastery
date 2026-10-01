import type { brandTone } from './drill';
import { expect } from 'vitest';
import { ACESFilmicToneMapping, NeutralToneMapping } from 'three';
export function checkRepair(repair: typeof brandTone): void {
 const state={toneMapping:ACESFilmicToneMapping,toneMappingExposure:1};repair(state,.7);expect(state.toneMapping).toBe(NeutralToneMapping);
}
