import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { undoTransform } from './drill';

describe('transforms.inverse-matrices', () => {
  it('undoes a rotated, scaled pose without changing the hit or saved matrix', () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(4, -2, 1),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 1, 0).normalize(), 0.5), new THREE.Vector3(2, 1, 3));
    const local = new THREE.Vector3(0.2, 3, -1), world = local.clone().applyMatrix4(matrix);
    const beforeWorld = world.clone(), beforeMatrix = matrix.clone();
    expect(answered(undoTransform(world, matrix)).distanceTo(local)).toBeLessThan(1e-6);
    expect(world.equals(beforeWorld) && matrix.equals(beforeMatrix)).toBe(true);
  });
});
