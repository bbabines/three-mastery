import type { Answer } from '@harness/drill';
import type { ParticleState } from '../../../../electives/vfx/integration-forces/drill';
import { Vector3 } from 'three';

export function stepParticle(position: Vector3, velocity: Vector3, acceleration: Vector3, drag: number, dt: number): Answer<ParticleState> {
  const nextVelocity = velocity.clone().addScaledVector(acceleration, dt).multiplyScalar(Math.exp(-drag * dt));
  return { velocity: nextVelocity, position: position.clone().addScaledVector(nextVelocity, dt) };
}
