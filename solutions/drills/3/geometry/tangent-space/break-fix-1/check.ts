import * as THREE from 'three';
import { expect } from 'vitest';
import type { normalFromMap } from './drill';

export function checkTangentSpace(subject: typeof normalFromMap): void {
  const t=new THREE.Vector3(1,0,0),b=new THREE.Vector3(0,0,1),n=new THREE.Vector3(0,-1,0),sample=new THREE.Vector3(0.2,0.8,0.9);
  const got=subject(sample,t,b,n), expected=t.clone().multiplyScalar(-0.6).addScaledVector(b,0.6).addScaledVector(n,0.8).normalize();
  expect(got.distanceTo(expected)).toBeLessThan(1e-6);
}
