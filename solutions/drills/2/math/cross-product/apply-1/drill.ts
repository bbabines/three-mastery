// Reference answer for drills/2/math/cross-product/apply-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export type Turn = 'left' | 'right' | 'straight';

export function turnAt(previous: Vector3, corner: Vector3, next: Vector3): Answer<Turn> {
  const arriving = corner.clone().sub(previous);
  const leaving = next.clone().sub(corner);
  const side = new Vector3().crossVectors(arriving, leaving).y;
  if (Math.abs(side) < 1e-6) return 'straight';
  return side > 0 ? 'left' : 'right';
}
