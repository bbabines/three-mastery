import * as THREE from 'three';
import { expect } from 'vitest';
import type { labelVisible } from './drill';

export function checkProjectUnproject(subject: typeof labelVisible): void {
  const camera=new THREE.PerspectiveCamera(55,1.2,0.2,80); camera.position.set(3,1,4); camera.updateWorldMatrix(true,false);
  const behind=camera.localToWorld(new THREE.Vector3(0.1,0,2)); expect(subject(camera,behind)).toBe(false);
}
