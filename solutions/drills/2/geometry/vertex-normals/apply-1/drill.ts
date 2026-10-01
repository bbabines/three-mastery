// Reference answer for drills/2/geometry/vertex-normals/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function hardEdges(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  const copy=geometry.index?geometry.toNonIndexed():geometry.clone(); copy.computeVertexNormals(); return copy;
}
