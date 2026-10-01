import * as THREE from 'three';
import { expect } from 'vitest';
import type { viewportLens } from './drill';

export function checkProjectionMatrix(subject: typeof viewportLens): void {
  const w=300,h=900, near=0.1,far=40; const lens=subject(70,w,h,near,far);
  const target=new THREE.PerspectiveCamera(70,w/h,near,far).projectionMatrix;
  const point=new THREE.Vector3(1,0,-5); expect(point.clone().applyMatrix4(lens).distanceTo(point.clone().applyMatrix4(target))).toBeLessThan(1e-6);
}
