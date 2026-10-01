// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function railPosition(start: THREE.Vector3, worldMotion: THREE.Vector3, railAxis: THREE.Vector3): THREE.Vector3 {
  return start.clone().add(worldMotion);
}
