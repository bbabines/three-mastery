// Reference repair for drills/3/interaction/hover-selection/break-fix-1.
import * as THREE from 'three';

export function nextEmphasis(hovered: boolean, selected: boolean, current: number, dt: number): number {
  const target=selected?1.2:hovered?1.1:1; return THREE.MathUtils.damp(current,target,12,dt);
}
