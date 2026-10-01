// Reference answer for drills/2/geometry/buffer-attribute/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function vertexColor(colors: THREE.BufferAttribute, vertexIndex: number): Answer<THREE.Vector3> {
  return new THREE.Vector3(colors.getX(vertexIndex),colors.getY(vertexIndex),colors.getZ(vertexIndex));
}
