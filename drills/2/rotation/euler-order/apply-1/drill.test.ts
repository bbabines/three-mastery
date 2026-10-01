import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { importTurn } from './drill';

describe('rotation.euler-order', () => {
  it('read three imported angles in their stated order and return an equivalent orientation, leaving the angles intact', () => {
    const angles=new THREE.Vector3(0.6,0.9,-0.3), before=angles.clone();
    for (const order of ['XYZ','YXZ','ZXY'] as THREE.EulerOrder[]) {
      const expected=new THREE.Object3D(); expected.rotation.set(angles.x,angles.y,angles.z,order);
      expect(answered(importTurn(angles,order)).angleTo(expected.quaternion)).toBeLessThan(1e-6);
    }
    expect(angles.equals(before)).toBe(true);
  });
});
