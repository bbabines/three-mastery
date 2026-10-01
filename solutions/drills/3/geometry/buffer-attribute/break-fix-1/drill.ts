// Reference repair for drills/3/geometry/buffer-attribute/break-fix-1.
import * as THREE from 'three';

export function vertexAt(positions: THREE.BufferAttribute, vertexIndex: number): THREE.Vector3 {
  return new THREE.Vector3(positions.getX(vertexIndex),positions.getY(vertexIndex),positions.getZ(vertexIndex));
}
