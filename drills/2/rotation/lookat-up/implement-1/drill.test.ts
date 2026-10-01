import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { aimWithUp } from './drill';

describe('rotation.lookat-up', () => {
  it('aims ordinary +Z with a tilted up without changing inputs', () => {
    const from = new THREE.Vector3(2, 1, 3);
    const target = new THREE.Vector3(-1, 2, 0);
    const up = new THREE.Vector3(1, 2, -0.5);
    const before = [from.clone(), target.clone(), up.clone()];
    const expected = new THREE.Object3D();
    expected.position.copy(from); expected.up.copy(up); expected.lookAt(target);
    const actual = answered(aimWithUp(from, target, up));
    expect(actual.angleTo(expected.quaternion)).toBeLessThan(1e-6);
    expect(from.equals(before[0]) && target.equals(before[1]) && up.equals(before[2])).toBe(true);
  });
});
