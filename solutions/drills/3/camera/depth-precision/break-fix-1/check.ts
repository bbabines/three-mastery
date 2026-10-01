import * as THREE from 'three';
import { expect } from 'vitest';
import type { depthBufferValue } from './drill';

export function checkDepthPrecision(subject: typeof depthBufferValue): void {
  const near=0.5,far=500; const c=new THREE.PerspectiveCamera(60,1,near,far);
  const got=subject(near,far,50); const projected=(new THREE.Vector3(0,0,-50).project(c).z+1)/2;
  expect(got).toBeCloseTo(projected,6);
}
