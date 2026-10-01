// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function placeInstance(mesh: THREE.InstancedMesh, index: number, pose: THREE.Matrix4): boolean {
  mesh.position.setFromMatrixPosition(pose); mesh.instanceMatrix.needsUpdate=true; return true;
}
