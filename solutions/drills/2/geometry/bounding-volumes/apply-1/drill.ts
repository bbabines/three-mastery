// Reference answer for drills/2/geometry/bounding-volumes/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function freshBoundingSphere(geometry: THREE.BufferGeometry): Answer<THREE.Sphere> {
  geometry.computeBoundingSphere(); return geometry.boundingSphere!.clone();
}
