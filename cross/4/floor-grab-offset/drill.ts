import type { Answer } from '@harness/drill';
import { Ray, Vector3 } from 'three';

// Place the part's origin at the ray's floor hit plus its original grab offset.
export function dragFloor(ray: Ray, grabbed: Vector3, origin: Vector3): Answer<Vector3> {
  return null;
}
