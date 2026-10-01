import * as THREE from 'three';
import { expect } from 'vitest';
import type { visibleAfterResize } from './drill';

export function checkFrustum(subject: typeof visibleAfterResize): void {
  const c=new THREE.PerspectiveCamera(60,1,0.1,100); c.position.z=5; const p=new THREE.Vector3(2,0,0);
  expect(subject(c,400,800,p)).toBe(false); expect(subject(c,900,400,p)).toBe(true);
}
