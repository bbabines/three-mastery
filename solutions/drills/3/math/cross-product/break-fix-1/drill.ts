import { Triangle, Vector3 } from 'three';

export function signedSide(a: Vector3, b: Vector3, c: Vector3, probe: Vector3): number {
  const normal = new Triangle(a, b, c).getNormal(new Vector3());
  return normal.dot(probe.clone().sub(a));
}
