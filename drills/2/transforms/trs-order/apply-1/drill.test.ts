import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { orbitWithScale } from './drill';

describe('transforms.trs-order', () => {
  it('scale and turn a point around a pivot, then put it back in the world at that pivot', () => {
    const point = new THREE.Vector3(4, 2, 1), pivot = new THREE.Vector3(1, 1, -2), scale = new THREE.Vector3(2, 1, 0.5);
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 1.1);
    const expected = point.clone().sub(pivot).applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(), rotation, scale)).add(pivot);
    expect(answered(orbitWithScale(point, pivot, rotation, scale)).distanceTo(expected)).toBeLessThan(1e-6);
    expect(point.equals(new THREE.Vector3(4, 2, 1))).toBe(true);
  });
});
