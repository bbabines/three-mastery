import { expectUnchanged, expectVector } from '@harness/check';
import { Matrix3, Object3D, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { worldVelocity } from './drill';

function expected(part: Object3D, local: Vector3) {
  part.updateWorldMatrix(true, false);
  return local.clone().applyMatrix3(new Matrix3().setFromMatrix4(part.matrixWorld));
}

describe('worldVelocity', () => {
  it('ignores translation but keeps rotation and scale', () => {
    const part = new Object3D();
    part.position.set(4, 2, -3);
    part.rotation.y = 0.7;
    part.scale.set(2, 1, 0.5);
    const local = new Vector3(0.3, 0, -1);
    expectVector(worldVelocity(part, local), expected(part, local));
  });

  it('works under a translated parent and with negative scale', () => {
    const parent = new Object3D();
    parent.position.set(-7, 1, 5);
    const part = new Object3D();
    part.position.set(0.5, 0, 0);
    part.scale.set(-1, 2, 1);
    parent.add(part);
    const local = new Vector3(1, 0.2, 0);
    expectVector(worldVelocity(part, local), expected(part, local));
  });

  it('does not change the local velocity', () => {
    const part = new Object3D();
    const local = new Vector3(1, 2, 3);
    worldVelocity(part, local);
    expectUnchanged(local, new Vector3(1, 2, 3), 'velocity');
  });
});
