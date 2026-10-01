import * as THREE from 'three';
import { expect } from 'vitest';
import type { prepareGlass } from './drill';

export function checkBlending(subject: typeof prepareGlass): void {
  const glass=subject(new THREE.MeshBasicMaterial(),0.25); expect(glass.transparent).toBe(true); expect(glass.depthWrite).toBe(false);
}
