import type { Answer } from '@harness/drill';

export interface Emission { count: number; carry: number }
// rate is particles per second. Add this frame's fractional work to carry, emit whole particles,
// and return the fraction for the next frame. dt is in seconds.
export function emit(rate: number, dt: number, carry: number): Answer<Emission> {
  return null;
}
