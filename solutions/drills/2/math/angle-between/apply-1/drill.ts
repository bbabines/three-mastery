// Reference answer for drills/2/math/angle-between/apply-1.
import type { Answer } from '@harness/drill';
import { MathUtils, Vector3 } from 'three';

const NORTH = new Vector3(0, 0, -1);
const DOWN = new Vector3(0, -1, 0); // turning around -Y is clockwise as seen from above

export function heading(direction: Vector3): Answer<number> {
  const flat = direction.clone().setY(0);
  const cross = new Vector3().crossVectors(NORTH, flat);
  const degrees = MathUtils.radToDeg(Math.atan2(cross.dot(DOWN), NORTH.dot(flat)));
  return (degrees + 360) % 360;
}
