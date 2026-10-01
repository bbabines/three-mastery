// Reference repair for drills/3/interaction/frame-rate-independence/break-fix-1.
import * as THREE from 'three';

export function smoothMove(current: number, target: number, rate: number, dt: number): number {
  return THREE.MathUtils.damp(current,target,rate,dt);
}
