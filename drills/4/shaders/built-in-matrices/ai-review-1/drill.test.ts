import { expectVector } from '@harness/check';
import { Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { worldNormalMatrix } from './drill';
describe('worldNormalMatrix', () => {
  it('keeps a world normal independent of the camera view', () => {
    const model = new Matrix4().compose(new Vector3(1, 2, 3), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.7), new Vector3(2, 1, 0.5));
    const local = new Vector3(1, 1, 0).normalize();
    const expected = local.clone().applyMatrix3(new Matrix3().getNormalMatrix(model)).normalize();
    for (const angle of [0, 0.5, -1.2]) {
      const view = new Matrix4().makeRotationY(angle);
      expectVector(local.clone().applyMatrix3(worldNormalMatrix(model, view)).normalize(), expected, 'world normal');
    }
  });
});
