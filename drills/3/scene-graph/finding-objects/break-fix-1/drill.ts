// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function findSku(root: THREE.Object3D, sku: string): THREE.Object3D | null {
  return root.getObjectByName(sku)??null;
}
