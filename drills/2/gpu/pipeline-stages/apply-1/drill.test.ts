import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { fragmentOutcome } from './drill';

describe('fragmentOutcome', () => {
it('does not call every fragment a final pixel', () => {
    expect(answered(fragmentOutcome(100,18,27))).toEqual({candidates:100,written:55});
    expect(answered(fragmentOutcome(10,0,0))).toEqual({candidates:10,written:10});
  });
});
