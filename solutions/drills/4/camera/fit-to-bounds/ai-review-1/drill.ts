import { MathUtils } from 'three';
export function fitSphere(radius: number, verticalFov: number, aspect: number): number {
  const halfVertical = MathUtils.degToRad(verticalFov) / 2;
  const halfHorizontal = Math.atan(Math.tan(halfVertical) * aspect);
  return radius / Math.sin(Math.min(halfVertical, halfHorizontal));
}
