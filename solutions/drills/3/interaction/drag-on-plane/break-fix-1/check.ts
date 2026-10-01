import * as THREE from 'three';
import { expect } from 'vitest';
import type { dragPosition } from './drill';

export function checkDragOnPlane(subject: typeof dragPosition): void {
  const hit=new THREE.Vector3(-4,2,1), offset=new THREE.Vector3(0.8,0,-1.2), before=hit.clone();
  expect(subject(hit,offset).distanceTo(hit.clone().add(offset))).toBeLessThan(1e-6); expect(hit.equals(before)).toBe(true);
}
