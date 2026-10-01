import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';
export function lambertResponse(normal: Vector3, toLight: Vector3, albedo: number, irradiance: number): Answer<number> {
  const cosine = Math.max(0, normal.clone().normalize().dot(toLight.clone().normalize()));
  return albedo * irradiance * cosine / Math.PI;
}
