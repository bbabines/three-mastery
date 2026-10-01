import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { mirrorsSpace } from './drill';

describe('mirrorsSpace', () => {
it('distinguishes one negative axis from two', () => {
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,1,0).normalize(),0.6);
    const matrix = (scale: THREE.Vector3) => new THREE.Matrix4().compose(new THREE.Vector3(1,2,3),rotation,scale);
    expectExact(mirrorsSpace(matrix(new THREE.Vector3(-2,3,4))),true);
    expectExact(mirrorsSpace(matrix(new THREE.Vector3(-2,-3,4))),false);
    expectExact(mirrorsSpace(matrix(new THREE.Vector3(2,3,4))),false);
  });
});
