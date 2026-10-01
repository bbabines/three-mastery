import { MathUtils } from 'three';

export function textureSize(cssPixels: number, dpr: number, sourceSize: number): number {
  return Math.min(sourceSize, MathUtils.ceilPowerOfTwo(Math.max(1, cssPixels * dpr)));
}
