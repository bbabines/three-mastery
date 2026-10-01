import { expectNumber, expectUnchanged } from '@harness/check';
import { Triangle, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { signedSide } from './drill';

function expected(a: Vector3, b: Vector3, c: Vector3, probe: Vector3) {
  return new Triangle(a, b, c).getNormal(new Vector3()).dot(probe.clone().sub(a));
}

describe('signedSide', () => {
  it('keeps the sign for probes on both sides of a panel', () => {
    const [a, b, c] = [new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0)];
    for (const probe of [new Vector3(0.2, 0.2, 2), new Vector3(0.2, 0.2, -3)]) {
      expectNumber(signedSide(a, b, c, probe), expected(a, b, c, probe));
    }
  });

  it('works for a slanted panel away from the origin', () => {
    const [a, b, c] = [new Vector3(2, 1, 4), new Vector3(4, 1, 5), new Vector3(2, 3, 5)];
    const normal = new Triangle(a, b, c).getNormal(new Vector3());
    for (const sign of [-1, 1]) {
      const probe = a.clone().addScaledVector(normal, sign * 1.2);
      expectNumber(signedSide(a, b, c, probe), expected(a, b, c, probe));
    }
  });

  it('does not change the points', () => {
    const points = [new Vector3(2, 1, 4), new Vector3(4, 1, 5), new Vector3(2, 3, 5), new Vector3(3, 2, 6)];
    const saved = points.map((point) => point.clone());
    signedSide(points[0], points[1], points[2], points[3]);
    points.forEach((point, i) => expectUnchanged(point, saved[i], `point ${i}`));
  });
});
