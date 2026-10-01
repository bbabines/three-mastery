// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function moveInterleaved(position: THREE.InterleavedBufferAttribute, index: number, point: THREE.Vector3): boolean {
  const at=index*position.itemSize; position.data.array[at]=point.x; position.data.array[at+1]=point.y; position.data.array[at+2]=point.z; return true;
}
