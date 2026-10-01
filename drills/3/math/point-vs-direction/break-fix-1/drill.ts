import { Vector3 } from 'three';

// Return the nearest part's index within radius of center, or -1. Inputs are world-space positions.
export function nearestWithin(center: Vector3, parts: Vector3[], radius: number): number {
  let nearest = -1;
  let best = radius * radius;
  for (let i = 0; i < parts.length; i++) {
    const distanceSq = parts[i].lengthSq();
    if (distanceSq <= best) {
      best = distanceSq;
      nearest = i;
    }
  }
  return nearest;
}
