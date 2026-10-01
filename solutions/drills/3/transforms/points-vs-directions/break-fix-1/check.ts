import { expect } from 'vitest';
import { Matrix3, Object3D, Vector3 } from 'three';

type Velocity = (part: Object3D, localVelocity: Vector3) => Vector3;

export function checkVelocity(worldVelocity: Velocity): void {
  const part = new Object3D();
  part.position.set(12, -4, 8);
  part.rotation.y = 0.4;
  part.scale.set(1.5, 1, 0.7);
  const local = new Vector3(0.5, 0, -0.2);
  part.updateMatrixWorld();
  const expected = local.clone().applyMatrix3(new Matrix3().setFromMatrix4(part.matrixWorld));
  expect(worldVelocity(part, local).distanceTo(expected)).toBeLessThan(1e-5);
}
