import type { Answer } from '@harness/drill';

// Depths are positive distances from the camera in the same units. Return zero where a particle
// meets or passes the opaque surface, rising linearly to one over fadeDistance in front of it.
export function softFade(sceneDepth: number, particleDepth: number, fadeDistance: number): Answer<number> {
  return null;
}
