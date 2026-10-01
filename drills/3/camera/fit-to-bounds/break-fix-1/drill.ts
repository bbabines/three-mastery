// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function fitAndPixelSize(radius: number, verticalFovDegrees: number, aspect: number, viewportHeight: number): { distance: number; unitsPerPixel: number } {
  const half=THREE.MathUtils.degToRad(verticalFovDegrees)/2; const distance=radius/Math.sin(half);
  return {distance,unitsPerPixel:2*distance*Math.tan(half)/viewportHeight};
}
