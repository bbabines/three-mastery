import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pointerNdc } from './drill';

describe('pointerNdc', () => {
it('uses the canvas rectangle, including its offset and non-square size', () => {
    const rect = { left: 120, top: 70, width: 640, height: 320 };
    const center = answered(pointerNdc(440, 230, rect)); expect(center.x).toBeCloseTo(0); expect(center.y).toBeCloseTo(0);
    const corner = answered(pointerNdc(120, 70, rect)); expect(corner.x).toBeCloseTo(-1); expect(corner.y).toBeCloseTo(1);
  });
});
