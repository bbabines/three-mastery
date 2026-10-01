import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { thumbnailTarget } from './drill';

describe('thumbnailTarget', () => {
it('creates an offscreen target with its own depth attachment', () => {
    const target = answered(thumbnailTarget(256,144));
    expect(target.width).toBe(256); expect(target.height).toBe(144); expect(target.depthBuffer).toBe(true); expect(target.stencilBuffer).toBe(false);
    target.dispose();
  });
});
