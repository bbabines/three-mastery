import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveAlongLocalX } from './drill';

describe('moveAlongLocalX', () => {
it('uses both parent and child rotation', () => {
    const parent = new THREE.Group(); parent.position.set(2,0,1); parent.rotation.y=0.4;
    const child = new THREE.Mesh(); child.rotation.z=0.7; child.position.set(0.5,1,0); parent.add(child); parent.updateMatrixWorld(true);
    const direction = new THREE.Vector3(1,0,0).applyQuaternion(child.getWorldQuaternion(new THREE.Quaternion()));
    const world = child.getWorldPosition(new THREE.Vector3()).addScaledVector(direction,2);
    expectVector(moveAlongLocalX(child,2),parent.worldToLocal(world));
  });
});
