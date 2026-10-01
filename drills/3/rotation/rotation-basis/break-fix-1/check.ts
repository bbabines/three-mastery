import type { Euler, Vector3 } from 'three';

type Forward = (angles: Euler) => Vector3;

export function checkBasis(_forwardFromEuler: Forward): void {
  throw new Error('Write the regression check in check.ts');
}
