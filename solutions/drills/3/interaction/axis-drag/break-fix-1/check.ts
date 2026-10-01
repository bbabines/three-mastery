import * as THREE from 'three';
import { expect } from 'vitest';
import type { railPosition } from './drill';

export function checkAxisDrag(subject: typeof railPosition): void {
  const start=new THREE.Vector3(-2,1,4), motion=new THREE.Vector3(2,-3,1), axis=new THREE.Vector3(1,1,0).normalize();
  const got=subject(start,motion,axis), delta=got.clone().sub(start);
  expect(delta.clone().projectOnPlane(axis).length()).toBeLessThan(1e-6); expect(delta.dot(axis)).toBeCloseTo(motion.dot(axis),6);
}
