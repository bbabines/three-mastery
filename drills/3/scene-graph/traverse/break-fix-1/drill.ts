// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function visibleMeshCount(root: THREE.Object3D): number {
  let count=0; root.traverse(o=>{if(o instanceof THREE.Mesh)count++;}); return count;
}
