// Reference repair for drills/3/interaction/controls-tour/break-fix-1.
import * as THREE from 'three';

export function gizmoMode(orbit: {enabled:boolean; update:()=>void}, dragging: boolean): boolean {
  orbit.enabled=!dragging; if(!dragging)orbit.update(); return orbit.enabled;
}
