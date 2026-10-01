import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { orbitOnAxis } from './drill';

describe('rotation.axis-angle', () => {
  it('turns around an off-center, tilted hinge without changing any input', () => {
    const point = new THREE.Vector3(4, 0, 2);
    const center = new THREE.Vector3(1, 1, -2);
    const axis = new THREE.Vector3(1, 2, 1);
    const before = [point.clone(), center.clone(), axis.clone()];
    for (const angle of [0.7, -0.4]) {
      const expected = point.clone().sub(center).applyQuaternion(
        new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), angle),
      ).add(center);
      expect(answered(orbitOnAxis(point, center, axis, angle)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(point.equals(before[0]) && center.equals(before[1]) && axis.equals(before[2])).toBe(true);
  });
});
