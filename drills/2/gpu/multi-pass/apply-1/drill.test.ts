import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { outputLast } from './drill';

describe('outputLast', () => {
it('moves a premature output pass to the end without mutating the list', () => {
    const passes = ['render','output','bloom','fxaa'];
    expect(answered(outputLast(passes))).toEqual(['render','bloom','fxaa','output']);
    expect(passes).toEqual(['render','output','bloom','fxaa']);
    expect(answered(outputLast(['render','output']))).toEqual(['render','output']);
  });
});
