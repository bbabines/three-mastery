import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { faceToward } from './drill';

describe('transforms.normal-matrix', () => {
  it('uses the corrected world normal and preserves both directions', () => {
    const part = new THREE.Object3D(); part.scale.set(3, 1, 0.5); part.rotation.y = 0.7;
    const normal = new THREE.Vector3(1, 0, 1).normalize(); part.updateMatrixWorld();
    const worldNormal = normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(part.matrixWorld)).normalize();
    const wrongNormal = normal.clone().transformDirection(part.matrixWorld);
    const view = worldNormal.clone().sub(wrongNormal), otherSide = view.clone().negate();
    const beforeNormal = normal.clone(), beforeView = view.clone();
    expect(answered(faceToward(part, normal, view))).toBe(true);
    expect(answered(faceToward(part, normal, otherSide))).toBe(false);
    expect(normal.equals(beforeNormal) && view.equals(beforeView)).toBe(true);
  });
});
