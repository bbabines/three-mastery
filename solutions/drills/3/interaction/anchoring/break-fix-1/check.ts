import * as THREE from 'three';
import { expect } from 'vitest';
import type { labelState } from './drill';

export function checkAnchoring(subject: typeof labelState): void {
  const camera=new THREE.PerspectiveCamera(60,1.5,0.1,100); camera.position.set(2,0,4); camera.updateMatrixWorld(); const behind=camera.localToWorld(new THREE.Vector3(0,0,2));
  expect(subject(camera,behind,900,600).visible).toBe(false);
}
