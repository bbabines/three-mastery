import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { placeVertex } from './drill';

describe('transforms.trs-order', () => {
  it('place a model vertex after scale, then rotation, then translation; return its world position without changing inputs', () => {
    const vertex = new THREE.Vector3(1, 2, -1), position = new THREE.Vector3(3, 0, 2), scale = new THREE.Vector3(2, 1, 3);
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.7);
    const actual = answered(placeVertex(vertex, position, rotation, scale));
    const expected = vertex.clone().multiply(scale).applyQuaternion(rotation).add(position);
    expect(actual.distanceTo(expected)).toBeLessThan(1e-6);
    expect(vertex.equals(new THREE.Vector3(1, 2, -1))).toBe(true);
  });
});
