// Reference answer for drills/2/math/projection-rejection/apply-1.
import type { Answer } from '@harness/drill';
import { Line3, Vector3 } from 'three';

export function keepClear(point: Vector3, pipeStart: Vector3, pipeEnd: Vector3, clearance: number): Answer<Vector3> {
  const nearest = new Line3(pipeStart, pipeEnd).closestPointToPoint(point, true, new Vector3());
  const away = point.clone().sub(nearest); // the leftover part, at right angles to the pipe
  if (away.lengthSq() >= clearance * clearance) return point.clone();
  return nearest.add(away.setLength(clearance));
}
