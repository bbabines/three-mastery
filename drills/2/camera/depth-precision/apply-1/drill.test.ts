import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { nearPlaneGain } from './drill';

describe('camera.depth-precision', () => {
  it('compare depth separation at a distant surface before and after moving the near plane outward', () => {
    const gain=answered(nearPlaneGain(100,0.01,1,1000));
    expect(gain).toBeGreaterThan(50);
    const equal=answered(nearPlaneGain(50,0.5,0.5,500)); expect(equal).toBeCloseTo(1,6);
  });
});
