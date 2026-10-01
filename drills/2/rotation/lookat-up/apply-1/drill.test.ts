import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cameraAim } from './drill';

describe('rotation.lookat-up', () => {
  it('aims camera −Z and honors a tilted up without changing inputs', () => {
    const from = new THREE.Vector3(1, 4, 5);
    const target = new THREE.Vector3(-2, 0, 1);
    const up = new THREE.Vector3(1, 2, -0.5);
    const before = [from.clone(), target.clone(), up.clone()];
    const expected = new THREE.PerspectiveCamera();
    expected.position.copy(from); expected.up.copy(up); expected.lookAt(target);
    const actual = answered(cameraAim(from, target, up));
    expect(actual.angleTo(expected.quaternion)).toBeLessThan(1e-6);
    expect(from.equals(before[0]) && target.equals(before[1]) && up.equals(before[2])).toBe(true);
  });
});
