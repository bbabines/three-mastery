// Reference answer for drills/2/geometry/indexed/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function separateFaces(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  return geometry.toNonIndexed();
}
