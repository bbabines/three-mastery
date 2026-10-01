import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';
export function toonDiffuse(normal: Vector3, toLight: Vector3, threshold: number): Answer<number> {
  const cosine = Math.max(0, normal.clone().normalize().dot(toLight.clone().normalize()));
  return cosine >= threshold ? 1 : 0.2;
}
