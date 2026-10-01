import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export interface ParticleState { position: Vector3; velocity: Vector3 }
// Advance one particle without changing the caller's vectors. Add acceleration for dt seconds,
// apply exponential drag, then move by that new velocity (semi-implicit Euler).
export function stepParticle(position: Vector3, velocity: Vector3, acceleration: Vector3, drag: number, dt: number): Answer<ParticleState> {
  return null;
}
