import * as THREE from 'three';
import { expect } from 'vitest';
import type { boundsInWorld } from './drill';

export function checkWorldBounds(subject: typeof boundsInWorld): void {
  const parent=new THREE.Group(), part=new THREE.Mesh(new THREE.BoxGeometry(1,2,3)); parent.add(part); parent.position.set(-3,2,4); parent.rotation.y=0.4;
  const got=subject(part); parent.updateWorldMatrix(true,true);
  const expected=new THREE.Box3().setFromObject(part,true);
  expect(got.min.distanceTo(expected.min)).toBeLessThan(1e-6); expect(got.max.distanceTo(expected.max)).toBeLessThan(1e-6);
}
