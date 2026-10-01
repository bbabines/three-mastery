// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function smoothMove(current: number, target: number, rate: number, dt: number): number {
  return THREE.MathUtils.lerp(current,target,0.1);
}
