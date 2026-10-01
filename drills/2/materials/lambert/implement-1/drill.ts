import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';
export function lambertResponse(normal: Vector3, toLight: Vector3, albedo: number, irradiance: number): Answer<number> {
  // Return reflected diffuse light without changing either vector.
  return null;
}
