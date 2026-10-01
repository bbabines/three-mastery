// Reference repair for drills/3/scene-graph/world-bounds/break-fix-1.
import * as THREE from 'three';

export function boundsInWorld(part: THREE.Object3D): THREE.Box3 {
  part.updateWorldMatrix(true,true); return new THREE.Box3().setFromObject(part,true);
}
