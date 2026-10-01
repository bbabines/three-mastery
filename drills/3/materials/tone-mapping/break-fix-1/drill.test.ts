import { ACESFilmicToneMapping, NeutralToneMapping } from 'three';
import { describe, expect, it } from 'vitest';
import { brandTone } from './drill';
describe('brandTone',()=>{
 it('selects Neutral for a product palette',()=>{const state={toneMapping:ACESFilmicToneMapping,toneMappingExposure:1};expect(brandTone(state,1.4)).toBe(state);expect(state.toneMapping).toBe(NeutralToneMapping);expect(state.toneMappingExposure).toBe(1.4);});
 it('accepts lower exposure without changing the operator',()=>{const state={toneMapping:ACESFilmicToneMapping,toneMappingExposure:2};brandTone(state,.6);expect(state.toneMapping).toBe(NeutralToneMapping);expect(state.toneMappingExposure).toBe(.6);});
});
