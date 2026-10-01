import type { Answer } from '@harness/drill';
import { Plane, Ray, Vector3 } from 'three';

export function dragFloor(ray: Ray, grabbed: Vector3, origin: Vector3): Answer<Vector3> {
  const floor = new Plane(new Vector3(0, 1, 0), -grabbed.y);
  const hit = ray.intersectPlane(floor, new Vector3());
  return hit ? hit.add(origin.clone().sub(grabbed)) : origin.clone();
}
