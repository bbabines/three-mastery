import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldHitNormal } from './drill';

describe('worldHitNormal', () => {
it('uses the normal matrix under rotation and non-uniform scale', () => {
    const parent = new THREE.Group(); parent.scale.set(3, 1, 0.4); parent.rotation.y = 0.47;
    const mesh = new THREE.Mesh(); mesh.rotation.x = 0.3; parent.add(mesh);
    const local = new THREE.Vector3(1, 1, 1).normalize(); const before = local.clone();
    parent.updateMatrixWorld(true);
    const expected = local.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld));
    expectVector(worldHitNormal(local, mesh), expected); expectUnchanged(local, before, 'normal');
  });
});
