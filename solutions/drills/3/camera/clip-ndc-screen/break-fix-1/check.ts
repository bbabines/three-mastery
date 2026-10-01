import * as THREE from 'three';
import { expect } from 'vitest';
import type { screenY } from './drill';

export function checkClipNdcScreen(subject: typeof screenY): void {
  const camera=new THREE.PerspectiveCamera(60,1,0.1,100); const ndc=new THREE.Vector3(0,0.7,-5).project(camera).y;
  expect(subject(ndc,700)).toBeCloseTo((1-ndc)*350,6);
}
