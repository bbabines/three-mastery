import { expect } from 'vitest';
import { Euler, Vector3 } from 'three';

type Forward = (angles: Euler) => Vector3;

export function checkBasis(forwardFromEuler: Forward): void {
  const angles = new Euler(0.4, 0.9, -0.3, 'YXZ');
  const expected = new Vector3(0, 0, 1).applyEuler(angles);
  expect(forwardFromEuler(angles).distanceTo(expected)).toBeLessThan(1e-5);
}
