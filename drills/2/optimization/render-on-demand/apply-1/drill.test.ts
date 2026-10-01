import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { shouldDraw, qualityStep } from './drill';

describe('shouldDraw', () => {
it('skips static and hidden-tab frames', () => {
    expectExact(shouldDraw(true,true),true); expectExact(shouldDraw(false,true),false);
    expectExact(shouldDraw(true,false),false);
  });
});

describe('qualityStep', () => {
it('uses a dead band so quality does not flap near target', () => {
    expectNumber(qualityStep(2,22,16,2),1); expectNumber(qualityStep(2,10,16,2),3);
    expectNumber(qualityStep(2,17,16,2),2); expectNumber(qualityStep(0,30,16,2),0);
  });
});
