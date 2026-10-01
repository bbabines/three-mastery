import * as THREE from 'three';
import { expect } from 'vitest';
import type { worldToView } from './drill';

export function checkViewMatrix(subject: typeof worldToView): void {
  const camera=new THREE.PerspectiveCamera(); camera.position.set(-3,2,6); camera.rotation.y=0.6;
  const world=new THREE.Vector3(2,1,-4); camera.updateWorldMatrix(true,false);
  const got=subject(camera,world); expect(got.clone().applyMatrix4(camera.matrixWorld).distanceTo(world)).toBeLessThan(1e-6);
}
