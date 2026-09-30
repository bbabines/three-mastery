// Reference answer for drills/2/math/projection-rejection/implement-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export function alongRail(drag: Vector3, rail: Vector3): Answer<Vector3> {
  return drag.clone().projectOnVector(rail);
}
