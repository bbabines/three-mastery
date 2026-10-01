// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function hitNormalWorld(hit: { object: THREE.Object3D; face: { normal: THREE.Vector3 } }): THREE.Vector3 {
  hit.object.updateWorldMatrix(true,false); return hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
}
