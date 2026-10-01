import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldVelocity } from './drill';

describe('transforms.points-vs-directions', () => {
  it('keeps the scale effect on speed but drops translation without changing inputs', () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(10, 0, 0),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.8), new THREE.Vector3(2, 1, 0.5));
    const velocity = new THREE.Vector3(1, 2, 3);
    const beforeVelocity = velocity.clone(), beforeMatrix = matrix.clone();
    const expected = velocity.clone().applyMatrix4(matrix).sub(new THREE.Vector3().applyMatrix4(matrix));
    expect(answered(worldVelocity(velocity, matrix)).distanceTo(expected)).toBeLessThan(1e-6);
    expect(velocity.equals(beforeVelocity) && matrix.equals(beforeMatrix)).toBe(true);
  });
});
