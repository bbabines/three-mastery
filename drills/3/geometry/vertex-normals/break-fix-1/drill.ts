// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function flatNormals(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const copy=geometry.clone(); copy.computeVertexNormals(); return copy;
}
