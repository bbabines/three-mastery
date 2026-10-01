import { Matrix4, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { isMirrored } from './drill';

describe('isMirrored', () => {
  it('uses basis handedness rather than one axis component', () => {
    for (const [angle, scale] of [
      [0, new Vector3(1, 2, 1)], [Math.PI, new Vector3(1, 2, 1)],
      [0, new Vector3(-1, 2, 1)], [Math.PI, new Vector3(-1, 2, 1)],
    ] as const) {
      const matrix = new Matrix4().compose(new Vector3(3, 1, -2), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angle), scale);
      const before = matrix.clone();
      expect(isMirrored(matrix)).toBe(matrix.determinant() < 0);
      expect(matrix.elements).toEqual(before.elements);
    }
  });
});
