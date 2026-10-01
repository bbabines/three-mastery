// Reference answer for drills/2/geometry/vertex-normals/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function smoothNormals(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  const copy=geometry.clone(); copy.computeVertexNormals(); return copy;
}
