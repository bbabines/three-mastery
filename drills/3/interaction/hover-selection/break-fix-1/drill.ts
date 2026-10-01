// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function nextEmphasis(hovered: boolean, selected: boolean, current: number, dt: number): number {
  const target=hovered?1.1:1; return THREE.MathUtils.lerp(current,target,0.1);
}
