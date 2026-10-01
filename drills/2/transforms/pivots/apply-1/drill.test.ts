import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { swingDoor } from './drill';

describe('transforms.pivots', () => {
  it('swings around an offset hinge in both directions without changing the points', () => {
    const hinge = new THREE.Vector3(3, 0, -2), point = new THREE.Vector3(4, 1, -2);
    const beforeHinge = hinge.clone(), beforePoint = point.clone();
    for (const angle of [0, Math.PI / 2, -Math.PI / 3]) {
      const expected = point.clone().sub(hinge).applyQuaternion(
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle),
      ).add(hinge);
      expect(answered(swingDoor(hinge, point, angle)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(hinge.equals(beforeHinge) && point.equals(beforePoint)).toBe(true);
  });
});
