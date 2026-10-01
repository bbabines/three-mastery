import * as THREE from 'three';
import { expect } from 'vitest';
import type { segmentSnap } from './drill';

export function checkClosestPoint(subject: typeof segmentSnap): void {
  const a=new THREE.Vector3(1,0,1), b=new THREE.Vector3(1,3,1), p=new THREE.Vector3(3,6,1);
  expect(subject(p,a,b).distanceTo(b)).toBeLessThan(1e-6);
}
