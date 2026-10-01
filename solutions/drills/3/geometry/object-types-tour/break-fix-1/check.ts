import * as THREE from 'three';
import { expect } from 'vitest';
import type { placeInstance } from './drill';

export function checkObjectTypesTour(subject: typeof placeInstance): void {
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial(),5);
  const pose=new THREE.Matrix4().makeTranslation(-2,1,4); subject(mesh,4,pose);
  const got=new THREE.Matrix4(); mesh.getMatrixAt(4,got);
  expect(new THREE.Vector3().setFromMatrixPosition(got).distanceTo(new THREE.Vector3(-2,1,4))).toBeLessThan(1e-6);
  expect(mesh.position.length()).toBe(0);
}
