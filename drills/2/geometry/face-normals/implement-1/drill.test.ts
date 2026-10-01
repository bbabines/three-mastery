import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { faceNormalWorld } from './drill';

describe('geometry.face-normals', () => {
  it('find a triangle face normal in world space after its model has been turned and unevenly stretched', () => {
    const a=new THREE.Vector3(0,0,0), b=new THREE.Vector3(2,0,1), c=new THREE.Vector3(0,1,2);
    const matrix=new THREE.Matrix4().compose(new THREE.Vector3(3,0,0),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.4),new THREE.Vector3(3,1,0.5));
    const n=answered(faceNormalWorld(a,b,c,matrix));
    const aw=a.clone().applyMatrix4(matrix), bw=b.clone().applyMatrix4(matrix), cw=c.clone().applyMatrix4(matrix);
    expect(n.angleTo(THREE.Triangle.getNormal(aw,bw,cw,new THREE.Vector3()))).toBeLessThan(1e-6);
  });
});
