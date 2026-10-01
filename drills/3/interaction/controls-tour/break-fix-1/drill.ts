// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function gizmoMode(orbit: {enabled:boolean; update:()=>void}, dragging: boolean): boolean {
  orbit.enabled=true; if(!dragging)orbit.update(); return orbit.enabled;
}
