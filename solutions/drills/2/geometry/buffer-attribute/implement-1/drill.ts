// Reference answer for drills/2/geometry/buffer-attribute/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function vertexPosition(position: THREE.BufferAttribute, index: number): Answer<THREE.Vector3> {
  return new THREE.Vector3(position.getX(index),position.getY(index),position.getZ(index));
}
