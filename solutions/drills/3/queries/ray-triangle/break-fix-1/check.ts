import * as THREE from 'three';
import { expect } from 'vitest';
import type { uvAtHit } from './drill';

export function checkRayTriangle(subject: typeof uvAtHit): void {
  const a=new THREE.Vector3(0,0,0),b=new THREE.Vector3(3,0,0),c=new THREE.Vector3(0,3,0), ray=new THREE.Ray(new THREE.Vector3(1,1,5),new THREE.Vector3(0,0,-1));
  const got=subject(ray,a,b,c,new THREE.Vector2(),new THREE.Vector2(1,0),new THREE.Vector2(0,1)); expect(got!.distanceTo(new THREE.Vector2(1/3,1/3))).toBeLessThan(1e-6);
}
