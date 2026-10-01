import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { liftToFloor } from './drill';

describe('liftToFloor', () => {
it('uses the lowest world point, not the root position', () => {
    const root = new THREE.Group(); root.position.y = 2; root.rotation.z = 0.42;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1)); mesh.position.x = 1; root.add(mesh);
    root.updateMatrixWorld(true);
    const bottom = new THREE.Box3().setFromObject(root, true).min.y;
    expectNumber(liftToFloor(root), -bottom);
    expectNumber(liftToFloor(root), -bottom);
    expect(root.position.y).toBe(2);
  });
});
