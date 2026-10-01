// Reference repair for drills/3/interaction/pointer-events/break-fix-1.
import * as THREE from 'three';

export function isClick(down: THREE.Vector2, up: THREE.Vector2, dpr: number, thresholdCss: number): boolean {
  return down.distanceTo(up)<=thresholdCss;
}
