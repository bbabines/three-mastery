import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { postFragments } from './drill';

describe('postFragments', () => {
it('scales with both resolution and pass count', () => {
    expectNumber(postFragments(1920,1080,3),1920*1080*3);
    expectNumber(postFragments(960,540,3),960*540*3);
    expect(answered(postFragments(1920,1080,3))).toBe(4*answered(postFragments(960,540,3)));
  });
});
