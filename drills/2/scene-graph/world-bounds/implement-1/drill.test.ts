import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { tightWorldSize } from './drill';

describe('tightWorldSize', () => {
it('uses a tight world box under a turned and scaled parent', () => {
    const root = new THREE.Group(); root.position.set(1, 2, -3); root.scale.set(2, 1, 0.5); root.rotation.y = 0.48;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 3)); mesh.rotation.z = 0.3; root.add(mesh);
    const hidden = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5)); hidden.position.x = 5; hidden.visible = false; root.add(hidden);
    root.updateMatrixWorld(true);
    const expected = new THREE.Box3().setFromObject(root, true).getSize(new THREE.Vector3());
    expectVector(tightWorldSize(root), expected);
    expect(root.position.toArray()).toEqual([1, 2, -3]);
  });
});
