// Reference repair for drills/3/scene-graph/traverse/break-fix-1.
import * as THREE from 'three';

export function visibleMeshCount(root: THREE.Object3D): number {
  let count=0; root.traverseVisible(o=>{if(o instanceof THREE.Mesh)count++;}); return count;
}
