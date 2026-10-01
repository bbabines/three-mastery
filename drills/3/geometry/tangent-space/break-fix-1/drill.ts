// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function normalFromMap(sample: THREE.Vector3, tangent: THREE.Vector3, bitangent: THREE.Vector3, normal: THREE.Vector3): THREE.Vector3 {
  return sample.clone().normalize();
}
