// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function vertexAt(positions: THREE.BufferAttribute, vertexIndex: number): THREE.Vector3 {
  return new THREE.Vector3(positions.array[vertexIndex] as number,positions.array[vertexIndex+1] as number,positions.array[vertexIndex+2] as number);
}
