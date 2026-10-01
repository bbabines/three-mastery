import type { Euler, Quaternion } from 'three';

type Blend = (from: Euler, to: Euler, t: number) => Quaternion;

export function checkBlend(_blendOrientation: Blend): void {
  throw new Error('Write the regression check in check.ts');
}
