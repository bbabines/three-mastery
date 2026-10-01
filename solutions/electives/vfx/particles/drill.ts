import type { Answer } from '@harness/drill';
import type { Emission } from '../../../../electives/vfx/particles/drill';

export function emit(rate: number, dt: number, carry: number): Answer<Emission> {
  const total = carry + rate * dt;
  const count = Math.floor(total);
  return { count, carry: total - count };
}
