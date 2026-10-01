import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldTransform } from './drill';

describe('transforms.matrix-vs-matrixworld', () => {
  it('captures the fresh full world matrix as an independent snapshot', () => {
    const parent = new THREE.Group(), part = new THREE.Object3D(); parent.add(part);
    parent.position.set(4, 2, -3); parent.rotation.y = 0.7;
    part.position.set(1, 0, 2); part.scale.set(1.5, 0.8, 2);
    const actual = answered(worldTransform(part));
    parent.updateWorldMatrix(true, true);
    const expected = part.matrixWorld.clone();
    for (const probe of [new THREE.Vector3(), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 1)]) {
      expect(probe.clone().applyMatrix4(actual).distanceTo(probe.clone().applyMatrix4(expected))).toBeLessThan(1e-6);
    }
    expect(actual).not.toBe(part.matrixWorld);
    parent.position.x += 3; parent.updateWorldMatrix(true, true);
    expect(actual.equals(expected)).toBe(true);
  });
});
