import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveRay } from './drill';

describe('transforms.points-vs-directions', () => {
  it('moves a ray origin with translation and its aim without translation or scale length', () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(4, 2, -1),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.6), new THREE.Vector3(2, 0.7, 1.5));
    const point = new THREE.Vector3(1, 0.3, -0.4), direction = new THREE.Vector3(0.3, 0.2, -2);
    const beforePoint = point.clone(), beforeDirection = direction.clone(), beforeMatrix = matrix.clone();
    const actual = answered(moveRay(point, direction, matrix));
    expect(actual.point.distanceTo(point.clone().applyMatrix4(matrix))).toBeLessThan(1e-6);
    expect(actual.direction.distanceTo(direction.clone().transformDirection(matrix))).toBeLessThan(1e-6);
    expect(actual.direction.length()).toBeCloseTo(1, 6);
    expect(point.equals(beforePoint) && direction.equals(beforeDirection) && matrix.equals(beforeMatrix)).toBe(true);
  });
});
