// Reference repair for drills/3/interaction/axis-drag/break-fix-1.
import * as THREE from 'three';

export function railPosition(start: THREE.Vector3, worldMotion: THREE.Vector3, railAxis: THREE.Vector3): THREE.Vector3 {
  return start.clone().add(worldMotion.clone().projectOnVector(railAxis));
}
