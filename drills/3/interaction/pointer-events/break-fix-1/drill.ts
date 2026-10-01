// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function isClick(down: THREE.Vector2, up: THREE.Vector2, dpr: number, thresholdCss: number): boolean {
  return down.distanceTo(up)*dpr<=thresholdCss;
}
