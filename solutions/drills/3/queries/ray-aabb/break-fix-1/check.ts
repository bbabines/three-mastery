import * as THREE from 'three';
import { expect } from 'vitest';
import type { rotatedBoxHit } from './drill';

export function checkRayAabb(subject: typeof rotatedBoxHit): void {
  const box=new THREE.Box3(new THREE.Vector3(-2,-0.5,-0.2),new THREE.Vector3(2,0.5,0.2)), m=new THREE.Matrix4().compose(new THREE.Vector3(-4,1,2),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.5),new THREE.Vector3(1,1,1));
  const ray=new THREE.Ray(new THREE.Vector3(-4,1,8),new THREE.Vector3(0,0,-1)), got=subject(ray,box,m);
  expect(got).not.toBeNull();
  const local = got!.clone().applyMatrix4(m.clone().invert());
  expect(local.distanceTo(box.clampPoint(local.clone(), new THREE.Vector3()))).toBeLessThan(1e-6);
}
