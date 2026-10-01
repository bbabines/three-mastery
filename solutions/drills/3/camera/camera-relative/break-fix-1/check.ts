import * as THREE from 'three';
import { expect } from 'vitest';
import type { cameraRight } from './drill';

export function checkCameraRelative(subject: typeof cameraRight): void {
  const c=new THREE.PerspectiveCamera(); c.rotation.set(Math.PI/2,0.7,0,'YXZ'); c.updateWorldMatrix(true,false);
  const got=subject(c), expected=new THREE.Vector3().setFromMatrixColumn(c.matrixWorld,0).normalize();
  expect(got.length()).toBeCloseTo(1,6); expect(got.distanceTo(expected)).toBeLessThan(1e-6);
}
