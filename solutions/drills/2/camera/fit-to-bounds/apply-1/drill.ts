// Reference answer for drills/2/camera/fit-to-bounds/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function distanceForRadius(radius: number, verticalFovDegrees: number, aspect: number): Answer<number> {
  const vertical=THREE.MathUtils.degToRad(verticalFovDegrees)/2;
  const horizontal=Math.atan(Math.tan(vertical)*aspect);
  return radius/Math.sin(Math.min(vertical,horizontal));
}

export function worldPerPixel(viewDepth: number, verticalFovDegrees: number, viewportHeight: number): Answer<number> {
  return 2 * viewDepth * Math.tan(THREE.MathUtils.degToRad(verticalFovDegrees) / 2) / viewportHeight;
}
