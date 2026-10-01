// Reference repair for drills/3/camera/fit-to-bounds/break-fix-1.
import * as THREE from 'three';

export function fitAndPixelSize(radius: number, verticalFovDegrees: number, aspect: number, viewportHeight: number): { distance: number; unitsPerPixel: number } {
  const half=THREE.MathUtils.degToRad(verticalFovDegrees)/2; const horizontal=Math.atan(Math.tan(half)*aspect);
  const distance=radius/Math.sin(Math.min(half,horizontal));
  return {distance,unitsPerPixel:2*distance*Math.tan(half)/viewportHeight};
}
