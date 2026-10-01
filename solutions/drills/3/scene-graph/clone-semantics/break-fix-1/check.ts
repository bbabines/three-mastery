import * as THREE from 'three';
import { expect } from 'vitest';
import type { variant } from './drill';

export function checkCloneSemantics(subject: typeof variant): void {
  const source=new THREE.Mesh(new THREE.SphereGeometry(),new THREE.MeshStandardMaterial({color:0x336699})); const copy=subject(source);
  (copy.material as THREE.MeshStandardMaterial).color.set(0xffffff);
  expect((source.material as THREE.MeshStandardMaterial).color.getHex()).toBe(0x336699);
}
