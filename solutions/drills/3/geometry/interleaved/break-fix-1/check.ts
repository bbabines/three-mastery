import * as THREE from 'three';
import { expect } from 'vitest';
import type { moveInterleaved } from './drill';

export function checkInterleaved(subject: typeof moveInterleaved): void {
  const data=new THREE.InterleavedBuffer(new Float32Array([0,0,0,0.2,0.4, 1,2,3,0.6,0.8, 4,5,6,0.1,0.3]),5);
  const pos=new THREE.InterleavedBufferAttribute(data,3,0), uv=new THREE.InterleavedBufferAttribute(data,2,3), before=data.version;
  subject(pos,2,new THREE.Vector3(8,9,10));
  expect(new THREE.Vector3(pos.getX(2),pos.getY(2),pos.getZ(2)).distanceTo(new THREE.Vector3(8,9,10))).toBeLessThan(1e-6);
  expect(uv.getX(2)).toBeCloseTo(0.1); expect(data.version).toBeGreaterThan(before);
}
