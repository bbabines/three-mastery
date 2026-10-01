import * as THREE from 'three';
import { expect } from 'vitest';
import type { candidateLeaves } from './drill';

export function checkBvh(subject: typeof candidateLeaves): void {
  const root=new THREE.Group(), left=new THREE.Object3D(), right=new THREE.Object3D(); root.userData.box=new THREE.Box3(new THREE.Vector3(-5,-1,-5),new THREE.Vector3(5,1,1)); left.userData.box=new THREE.Box3(new THREE.Vector3(-5,-1,-1),new THREE.Vector3(-2,1,1)); right.userData.box=new THREE.Box3(new THREE.Vector3(2,-1,-1),new THREE.Vector3(5,1,1)); root.add(left,right);
  const ray=new THREE.Ray(new THREE.Vector3(3,0,4),new THREE.Vector3(0,0,-1)); expect(subject(ray,root)).toEqual([right]);
}
