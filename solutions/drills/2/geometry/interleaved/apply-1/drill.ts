// Reference answer for drills/2/geometry/interleaved/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function moveInterleavedVertex(position: THREE.InterleavedBufferAttribute, index: number, newPosition: THREE.Vector3): Answer<boolean> {
  position.setXYZ(index,newPosition.x,newPosition.y,newPosition.z); position.data.needsUpdate=true; return true;
}
