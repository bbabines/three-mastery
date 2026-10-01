import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldFaceNormal } from './drill';

describe('geometry.face-normals', () => {
  it('repairs the reported symptom for a general case', () => {
    const a=new THREE.Vector3(0,0,0), b=new THREE.Vector3(2,0,1), c=new THREE.Vector3(0,1,2);
    const m=new THREE.Matrix4().compose(new THREE.Vector3(1,2,3),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.5),new THREE.Vector3(3,1,0.5));
    const before = [a.clone(), b.clone(), c.clone(), m.clone()];
    const got=worldFaceNormal(a,b,c,m);
    const expected=THREE.Triangle.getNormal(a.clone().applyMatrix4(m),b.clone().applyMatrix4(m),c.clone().applyMatrix4(m),new THREE.Vector3());
    expect(got.angleTo(expected)).toBeLessThan(1e-6);
    expect([a, b, c, m]).toEqual(before);
  });
});
