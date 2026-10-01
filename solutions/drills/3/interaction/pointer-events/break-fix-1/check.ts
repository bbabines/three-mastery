import * as THREE from 'three';
import { expect } from 'vitest';
import type { isClick } from './drill';

export function checkPointerEvents(subject: typeof isClick): void {
  const a=new THREE.Vector2(15,20), b=new THREE.Vector2(19,23); expect(subject(a,b,4,6)).toBe(true);
  expect(subject(a,new THREE.Vector2(25,20),4,6)).toBe(false);
}
