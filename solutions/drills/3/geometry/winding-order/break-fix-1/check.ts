import * as THREE from 'three';
import { expect } from 'vitest';
import type { flipFrontFace } from './drill';

export function checkWindingOrder(subject: typeof flipFrontFace): void {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const result = subject(geometry);
  const mesh = new THREE.Mesh(result, new THREE.MeshBasicMaterial({ side: THREE.FrontSide }));
  const front = new THREE.Raycaster(new THREE.Vector3(0.3, 0.2, 3), new THREE.Vector3(0, 0, -1));
  const back = new THREE.Raycaster(new THREE.Vector3(0.3, 0.2, -3), new THREE.Vector3(0, 0, 1));
  expect(front.intersectObject(mesh)).toHaveLength(0);
  expect(back.intersectObject(mesh)).toHaveLength(1);
}
