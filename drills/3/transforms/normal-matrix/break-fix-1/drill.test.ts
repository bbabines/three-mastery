import { expectUnchanged, expectVector } from '@harness/check';
import { Matrix3, Object3D, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { worldSurface } from './drill';

function expected(part: Object3D, localNormal: Vector3) {
  part.updateWorldMatrix(true, false);
  return localNormal.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(part.matrixWorld));
}

describe('worldSurface', () => {
  it('keeps a slanted normal correct under non-uniform scale', () => {
    const part = new Object3D();
    part.rotation.set(0.2, 0.7, -0.3);
    part.scale.set(3, 1, 0.5);
    const localNormal = new Vector3(1, 0.5, 1).normalize();
    const result = worldSurface(part, localNormal);
    expectVector(result.normal, expected(part, localNormal));
    expect(result.mirrored).toBe(false);
  });

  it('recognizes a mirrored stretched part', () => {
    const part = new Object3D();
    part.scale.set(-2, 1, 0.4);
    part.rotation.y = 0.6;
    const localNormal = new Vector3(1, 0, 1).normalize();
    const result = worldSurface(part, localNormal);
    expectVector(result.normal, expected(part, localNormal));
    expect(result.mirrored).toBe(true);
  });

  it('does not change the local normal', () => {
    const part = new Object3D();
    part.scale.set(2, 1, 0.5);
    const local = new Vector3(1, 0, 1).normalize();
    const saved = local.clone();
    worldSurface(part, local);
    expectUnchanged(local, saved, 'local normal');
  });
});
