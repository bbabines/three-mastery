import * as THREE from 'three';
import { expect } from 'vitest';
import type { visibleMeshCount } from './drill';

export function checkTraverse(subject: typeof visibleMeshCount): void {
  const root=new THREE.Group(), hidden=new THREE.Group(); root.add(new THREE.Mesh(),hidden); hidden.visible=false; hidden.add(new THREE.Mesh(),new THREE.Mesh()); expect(subject(root)).toBe(1);
}
