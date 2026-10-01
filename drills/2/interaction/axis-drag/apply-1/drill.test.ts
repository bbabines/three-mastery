import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { childRailPosition } from './drill';

describe('childRailPosition', () => {
it('converts a tilted world rail into parent-local position', () => {
    const parent = new THREE.Group(); parent.position.set(3,1,-2); parent.rotation.y=0.6; const child = new THREE.Mesh(); child.position.set(1,0,0); parent.add(child);
    const drag = new THREE.Vector3(2,1,3), axis = new THREE.Vector3(1,0,1); parent.updateMatrixWorld(true);
    const expected = parent.worldToLocal(child.getWorldPosition(new THREE.Vector3()).add(drag.clone().projectOnVector(axis)));
    expectVector(childRailPosition(child,drag,axis),expected); expectUnchanged(drag,new THREE.Vector3(2,1,3),'drag');
  });
});
