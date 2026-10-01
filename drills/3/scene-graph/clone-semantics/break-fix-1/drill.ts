// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function variant(source: THREE.Mesh): THREE.Mesh {
  return source.clone();
}
