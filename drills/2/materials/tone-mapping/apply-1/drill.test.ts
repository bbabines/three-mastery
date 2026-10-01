import { answered } from '@harness/check';
import { ACESFilmicToneMapping, NeutralToneMapping } from 'three';
import { describe, expect, it } from 'vitest';
import { setExposureStops } from './drill';
describe('setExposureStops', () => {
 it('changes one stop into a factor of two in either direction', () => {
  for (const [stops, expected] of [[-2, .25], [-1, .5], [0, 1], [1, 2], [2, 4]]) {
   const renderer = { toneMapping: ACESFilmicToneMapping, toneMappingExposure: 17 };
   expect(answered(setExposureStops(renderer, stops))).toBe(renderer);
   expect(renderer.toneMapping).toBe(NeutralToneMapping);
   expect(renderer.toneMappingExposure).toBe(expected);
  }
 });
});
