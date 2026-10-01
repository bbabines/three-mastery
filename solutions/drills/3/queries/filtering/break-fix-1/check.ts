import * as THREE from 'three';
import { expect } from 'vitest';
import type { selectableBoxHit } from './drill';

export function checkFiltering(subject: typeof selectableBoxHit): void {
  const ray=new THREE.Ray(new THREE.Vector3(1,0,8),new THREE.Vector3(0,0,-1)); const helper=new THREE.Object3D(),target=new THREE.Object3D();
  helper.userData.bounds=new THREE.Box3(new THREE.Vector3(0,-1,3),new THREE.Vector3(2,1,4)); target.userData.bounds=new THREE.Box3(new THREE.Vector3(0,-1,-2),new THREE.Vector3(2,1,-1)); target.userData.selectable=true;
  expect(subject(ray,[helper,target])).toBe(target);
}
