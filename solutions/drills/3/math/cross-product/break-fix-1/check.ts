import { expect } from 'vitest';
import { Triangle, Vector3 } from 'three';

type Side = (a: Vector3, b: Vector3, c: Vector3, probe: Vector3) => number;

export function checkSide(signedSide: Side): void {
  const a = new Vector3(-2, 1, 3);
  const b = new Vector3(0, 1, 4);
  const c = new Vector3(-2, 3, 4);
  const normal = new Triangle(a, b, c).getNormal(new Vector3());
  const probe = a.clone().addScaledVector(normal, 0.8);
  expect(signedSide(a, b, c, probe)).toBeCloseTo(normal.dot(probe.clone().sub(a)));
}
