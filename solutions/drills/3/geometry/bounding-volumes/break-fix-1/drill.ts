// Reference repair for drills/3/geometry/bounding-volumes/break-fix-1.
import * as THREE from 'three';

export function deformAndBound(geometry: THREE.BufferGeometry, index: number, point: THREE.Vector3): THREE.Sphere {
  const p=geometry.getAttribute('position'); p.setXYZ(index,point.x,point.y,point.z); p.needsUpdate=true; geometry.computeBoundingSphere(); return geometry.boundingSphere!.clone();
}
