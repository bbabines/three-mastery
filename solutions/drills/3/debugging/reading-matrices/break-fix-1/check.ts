import { expect } from 'vitest';
import { Matrix4, Quaternion, Vector3 } from 'three';

type Classify = (matrix: Matrix4) => boolean;

export function checkMirror(isMirrored: Classify): void {
  const ordinary = new Matrix4().compose(new Vector3(), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI), new Vector3(2, 1, 1));
  expect(isMirrored(ordinary), 'a half turn does not mirror the basis').toBe(false);
  const mirrored = ordinary.clone().multiply(new Matrix4().makeScale(-1, 1, 1));
  expect(isMirrored(mirrored), 'negative determinant reverses handedness').toBe(true);
}
