import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { faceToward } from './drill';

describe('transforms.normal-matrix', () => {
  it('decide whether an unevenly scaled face points toward a world-space viewer, using its correct world normal', () => {
    const part=new THREE.Object3D(); part.scale.set(3,1,0.5); part.rotation.y=0.7;
    const n=new THREE.Vector3(1,0,1).normalize(); part.updateMatrixWorld();
    const worldN=n.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(part.matrixWorld)).normalize();
    const wrongN = n.clone().transformDirection(part.matrixWorld);
    const separatingView = worldN.clone().sub(wrongN);
    expect(answered(faceToward(part,n,separatingView))).toBe(true);
    expect(answered(faceToward(part,n,separatingView.clone().negate()))).toBe(false);
  });
});
