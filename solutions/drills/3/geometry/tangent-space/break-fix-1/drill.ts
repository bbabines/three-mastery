// Reference repair for drills/3/geometry/tangent-space/break-fix-1.
import * as THREE from 'three';

export function normalFromMap(sample: THREE.Vector3, tangent: THREE.Vector3, bitangent: THREE.Vector3, normal: THREE.Vector3): THREE.Vector3 {
  const value=sample.clone().multiplyScalar(2).subScalar(1);
  return tangent.clone().multiplyScalar(value.x).addScaledVector(bitangent,value.y).addScaledVector(normal,value.z).normalize();
}
