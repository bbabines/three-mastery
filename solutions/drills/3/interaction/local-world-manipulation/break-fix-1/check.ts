import * as THREE from 'three';
import { expect } from 'vitest';
import type { moveByWorld } from './drill';

export function checkLocalWorldManipulation(subject: typeof moveByWorld): void {
  const parent=new THREE.Group(),part=new THREE.Object3D(); parent.rotation.y=-0.9; parent.position.set(-3,1,2); parent.add(part); const before=part.getWorldPosition(new THREE.Vector3());
  const got=subject(part,new THREE.Vector3(0,0,-2)), expected=before.add(new THREE.Vector3(0,0,-2));
  expect(got.distanceTo(expected)).toBeLessThan(1e-6);
  expect(part.getWorldPosition(new THREE.Vector3()).distanceTo(expected)).toBeLessThan(1e-6);
}
