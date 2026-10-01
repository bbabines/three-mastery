import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { smoothOrientation } from './drill';

describe('rotation.gimbal-lock', () => {
  it('takes the shortest quaternion arc through a steep camera turn', () => {
    const start = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.4, 2.9, 0.2, 'YXZ'));
    const end = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, -2.8, -0.2, 'YXZ'));
    const beforeStart = start.clone(), beforeEnd = end.clone();
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
      const actual = answered(smoothOrientation(start, end, fraction));
      const expected = start.clone().slerp(end, fraction);
      expect(actual.angleTo(expected)).toBeLessThan(1e-6);
    }
    expect(start.equals(beforeStart)).toBe(true);
    expect(end.equals(beforeEnd)).toBe(true);
  });
});
