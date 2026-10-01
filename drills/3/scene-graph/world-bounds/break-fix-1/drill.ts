// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function boundsInWorld(part: THREE.Object3D): THREE.Box3 {
  const mesh=part as THREE.Mesh; mesh.geometry.computeBoundingBox(); return mesh.geometry.boundingBox!.clone();
}
