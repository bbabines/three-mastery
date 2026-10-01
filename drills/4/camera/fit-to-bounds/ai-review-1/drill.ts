import { MathUtils } from 'three';
export function fitSphere(radius: number, verticalFov: number, aspect: number): number {
  return radius / Math.sin(MathUtils.degToRad(verticalFov) / 2);
}
