import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';
export function toonDiffuse(normal: Vector3, toLight: Vector3, threshold: number): Answer<number> {
  // Return 1 for lit, 0.2 for dark; do not change the input vectors.
  return null;
}
