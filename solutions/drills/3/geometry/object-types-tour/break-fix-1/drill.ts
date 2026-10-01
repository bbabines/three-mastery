// Reference repair for drills/3/geometry/object-types-tour/break-fix-1.
import * as THREE from 'three';

export function placeInstance(mesh: THREE.InstancedMesh, index: number, pose: THREE.Matrix4): boolean {
  mesh.setMatrixAt(index,pose); mesh.instanceMatrix.needsUpdate=true; mesh.computeBoundingSphere(); return true;
}
