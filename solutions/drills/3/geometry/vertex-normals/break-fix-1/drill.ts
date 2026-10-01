// Reference repair for drills/3/geometry/vertex-normals/break-fix-1.
import * as THREE from 'three';

export function flatNormals(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const copy=geometry.index?geometry.toNonIndexed():geometry.clone(); copy.computeVertexNormals(); return copy;
}
