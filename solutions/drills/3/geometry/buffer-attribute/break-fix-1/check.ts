import * as THREE from 'three';
import { expect } from 'vitest';
import type { vertexAt } from './drill';

export function checkBufferAttribute(subject: typeof vertexAt): void {
  const p=new THREE.Float32BufferAttribute([2,3,4, 5,6,7, 8,9,10, 11,12,13],3);
  expect(subject(p,3).distanceTo(new THREE.Vector3().fromBufferAttribute(p,3))).toBeLessThan(1e-6);
}
