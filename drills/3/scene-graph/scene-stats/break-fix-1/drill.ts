// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function visibleLayerMeshes(root: THREE.Object3D, layer: number): number {
  let n=0; root.traverseVisible(o=>{if(o instanceof THREE.Mesh)n++;}); return n;
}
