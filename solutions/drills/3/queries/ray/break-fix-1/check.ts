import * as THREE from 'three';
import { expect } from 'vitest';
import type { sphereEntry } from './drill';

export function checkRay(subject: typeof sphereEntry): void {
  const sphere=new THREE.Sphere(new THREE.Vector3(1,2,3),3), ray=new THREE.Ray(new THREE.Vector3(1,2,3),new THREE.Vector3(0,1,0));
  expect(subject(ray,sphere)!.distanceTo(new THREE.Vector3(1,5,3))).toBeLessThan(1e-6);
}
