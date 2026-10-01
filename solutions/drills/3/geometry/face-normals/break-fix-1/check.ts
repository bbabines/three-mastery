import * as THREE from 'three';
import { expect } from 'vitest';
import type { worldFaceNormal } from './drill';

export function checkFaceNormals(subject: typeof worldFaceNormal): void {
  const a=new THREE.Vector3(0,0,0),b=new THREE.Vector3(1,0,1),c=new THREE.Vector3(0,2,1);
  const m=new THREE.Matrix4().compose(new THREE.Vector3(-2,1,0),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,1,0).normalize(),0.7),new THREE.Vector3(0.5,3,2));
  const n=subject(a,b,c,m), x=b.clone().sub(a).applyMatrix3(new THREE.Matrix3().setFromMatrix4(m)), y=c.clone().sub(a).applyMatrix3(new THREE.Matrix3().setFromMatrix4(m));
  expect(Math.abs(n.dot(x))).toBeLessThan(1e-6); expect(Math.abs(n.dot(y))).toBeLessThan(1e-6);
}
