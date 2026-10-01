import { expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { worldDirection } from './drill';
describe('worldDirection', () => {
  it('ignores parent translation when converting a direction', () => {
    const parent = new Object3D(); parent.position.set(7, -3, 5); parent.rotation.set(0.3, 0.8, -0.2);
    const object = new Object3D(); parent.add(object); parent.updateMatrixWorld(true);
    const local = new Vector3(0.5, 0, 1); const before = local.clone();
    const expected = local.clone().transformDirection(object.matrixWorld);
    expectVector(worldDirection(object, local), expected, 'world direction');
    expectUnchanged(local, before, 'local direction');
  });
  it('uses a parent rotation changed since the last world-matrix update', () => {
    const parent = new Object3D();
    const object = new Object3D();
    parent.add(object);
    parent.updateMatrixWorld(true);
    parent.position.set(7, -3, 5);
    parent.rotation.y = Math.PI / 2;
    const local = new Vector3(0, 0, 1);
    const expected = local.clone().applyQuaternion(parent.quaternion);
    expectVector(worldDirection(object, local), expected, 'fresh parent rotation');
    expectVector(local, new Vector3(0, 0, 1), 'unchanged local direction');
  });
});
