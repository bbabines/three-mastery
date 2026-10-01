import { expect } from 'vitest';
import { Matrix3, Object3D, Vector3 } from 'three';
import type { WorldSurface } from './drill';

type Surface = (part: Object3D, localNormal: Vector3) => WorldSurface;

export function checkSurface(worldSurface: Surface): void {
  const part = new Object3D();
  part.rotation.set(0.2, 0.6, 0.1);
  part.scale.set(4, 0.5, 1);
  const localNormal = new Vector3(1, 1, 0).normalize();
  part.updateMatrixWorld();
  const expected = localNormal.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(part.matrixWorld));
  expect(worldSurface(part, localNormal).normal.distanceTo(expected)).toBeLessThan(1e-5);
}
