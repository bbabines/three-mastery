import { Triangle, Vector3 } from 'three';

// Signed distance from the ordered triangle's plane to probe: positive on its front side.
export function signedSide(a: Vector3, b: Vector3, c: Vector3, probe: Vector3): number {
  const normal = new Triangle(a, c, b).getNormal(new Vector3());
  return normal.dot(probe.clone().sub(a));
}
