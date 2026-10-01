import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { matrixTranslation } from './drill';

describe('matrixTranslation', () => {
it('reads translation after rotation and scale are present', () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(3,-2,7),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7),new THREE.Vector3(2,3,4));
    const before=matrix.clone(); expectVector(matrixTranslation(matrix),new THREE.Vector3().setFromMatrixPosition(matrix));
    expect(matrix.elements).toEqual(before.elements);
  });
});
