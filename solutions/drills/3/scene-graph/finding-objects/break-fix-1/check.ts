import * as THREE from 'three';
import { expect } from 'vitest';
import type { findSku } from './drill';

export function checkFindingObjects(subject: typeof findSku): void {
  const root=new THREE.Group(), a=new THREE.Mesh(), b=new THREE.Mesh(); a.name=b.name="part"; b.userData.sku="B"; root.add(a,new THREE.Group().add(b)); expect(subject(root,"B")).toBe(b);
}
