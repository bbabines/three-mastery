import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { nearPlaneGain } from './drill';

describe('camera.depth-precision', () => {
  it('compare depth separation at a distant surface before and after moving the near plane outward', () => {
    const gain=answered(nearPlaneGain(100,0.01,1,1000));
    expect(gain).toBeGreaterThan(50);
    const gap = (near: number) => {
      const lens = new THREE.PerspectiveCamera(60, 1, near, 1000);
      const at = (distance: number) => (new THREE.Vector3(0, 0, -distance).project(lens).z + 1) / 2;
      return at(100.01) - at(100);
    };
    expect(gain).toBeCloseTo(gap(1) / gap(0.01), 5);
    const equal=answered(nearPlaneGain(50,0.5,0.5,500)); expect(equal).toBeCloseTo(1,6);
  });
});
