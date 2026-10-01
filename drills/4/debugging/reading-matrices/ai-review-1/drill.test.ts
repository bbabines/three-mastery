import { expectVector } from '@harness/check';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { savedPosition } from './drill';
describe('savedPosition', () => {
  it('reads translation after a turn and nonuniform scale', () => {
    for (const at of [new Vector3(3, -2, 7), new Vector3(-4, 1, 2)]) {
      const matrix = new Matrix4().compose(at, new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.7), new Vector3(2, 1, 0.5));
      const expected = new Vector3(); matrix.decompose(expected, new Quaternion(), new Vector3());
      expectVector(savedPosition(matrix), expected, 'saved translation');
    }
  });
});
