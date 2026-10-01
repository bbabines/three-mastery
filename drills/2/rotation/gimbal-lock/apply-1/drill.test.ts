import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { smoothOrientation } from './drill';

describe('rotation.gimbal-lock', () => {
  it('blend a camera between two orientations on the shortest arc, including when its view passes near straight down', () => {
    const a=new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2,2.9,0,'YXZ'));
    const b=new THREE.Quaternion().setFromEuler(new THREE.Euler(1.4,-2.9,0,'YXZ'));
    const before=a.clone();
    for (const t of [0,0.25,0.5,0.75,1]) {
      const actual=answered(smoothOrientation(a,b,t));
      expect(actual.angleTo(a)).toBeCloseTo(a.angleTo(b) * t, 5);
    }
    expect(a.angleTo(before)).toBeLessThan(1e-6);
  });
});
