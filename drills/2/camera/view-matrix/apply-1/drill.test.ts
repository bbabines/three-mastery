import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { viewDepth } from './drill';

describe('camera.view-matrix', () => {
  it('find how far a world point lies in front of the camera along its viewing axis, rather than its straight-line distance', () => {
    const camera=new THREE.PerspectiveCamera(); camera.position.set(1,2,3); camera.rotation.y=0.5;
    const p=new THREE.Vector3(2,1,-4), before=p.clone(); camera.updateWorldMatrix(true,false);
    const expected=-p.clone().applyMatrix4(camera.matrixWorldInverse).z;
    expect(answered(viewDepth(camera,p))).toBeCloseTo(expected,6);
    expect(answered(viewDepth(camera,camera.localToWorld(new THREE.Vector3(0,0,-5))))).toBeCloseTo(5,6);
    expect(p.equals(before)).toBe(true);
  });
});
