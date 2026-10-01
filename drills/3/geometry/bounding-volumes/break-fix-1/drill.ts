// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function deformAndBound(geometry: THREE.BufferGeometry, index: number, point: THREE.Vector3): THREE.Sphere {
  const p=geometry.getAttribute('position'); p.setXYZ(index,point.x,point.y,point.z); p.needsUpdate=true; return geometry.boundingSphere!.clone();
}
