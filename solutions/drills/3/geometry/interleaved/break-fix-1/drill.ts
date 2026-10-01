// Reference repair for drills/3/geometry/interleaved/break-fix-1.
import * as THREE from 'three';

export function moveInterleaved(position: THREE.InterleavedBufferAttribute, index: number, point: THREE.Vector3): boolean {
  position.setXYZ(index,point.x,point.y,point.z); position.data.needsUpdate=true; return true;
}
