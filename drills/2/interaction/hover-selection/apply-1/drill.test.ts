import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { partState, setOrbitDragState } from './drill';

describe('partState', () => {
it('keeps selection when hover exits', () => {
    expectExact(partState(true,false),'selected'); expectExact(partState(true,true),'selected');
    expectExact(partState(false,true),'hover'); expectExact(partState(false,false),'none');
  });
});

describe('setOrbitDragState', () => {
it('disables orbit only during a custom drag', () => {
    const controls = {enabled:true}; expectExact(setOrbitDragState(controls,true),false); expect(controls.enabled).toBe(false);
    expectExact(setOrbitDragState(controls,false),true); expect(controls.enabled).toBe(true);
  });
});
