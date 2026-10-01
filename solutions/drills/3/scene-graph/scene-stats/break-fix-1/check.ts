import * as THREE from 'three';
import { expect } from 'vitest';
import type { visibleLayerMeshes } from './drill';

export function checkSceneStats(subject: typeof visibleLayerMeshes): void {
  const root=new THREE.Group(), a=new THREE.Mesh(), b=new THREE.Mesh(), hidden=new THREE.Group(); a.layers.set(3); b.layers.set(1); hidden.visible=false; hidden.add(new THREE.Mesh()); root.add(a,b,hidden);
  expect(subject(root,3)).toBe(1); expect(subject(root,1)).toBe(1);
}
