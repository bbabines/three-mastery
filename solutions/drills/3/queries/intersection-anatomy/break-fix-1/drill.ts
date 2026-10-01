// Reference repair for drills/3/queries/intersection-anatomy/break-fix-1.
import * as THREE from 'three';

export function hitNormalWorld(hit: { object: THREE.Object3D; face: { normal: THREE.Vector3 } }): THREE.Vector3 {
  hit.object.updateWorldMatrix(true,false); return hit.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)).normalize();
}
