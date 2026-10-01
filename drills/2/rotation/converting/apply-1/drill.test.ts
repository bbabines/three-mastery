import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { orientationFromEuler } from './drill';

describe('rotation.converting', () => {
  it('convert a saved euler turn into an equivalent quaternion, even when a later euler round-trip uses different angle numbers', () => {
    for (const euler of [new THREE.Euler(0.4,1.2,-0.7,'ZYX'),new THREE.Euler(1.5,0.8,2.1,'YXZ')]) {
      const before=euler.clone(), actual=answered(orientationFromEuler(euler));
      const object=new THREE.Object3D(); object.rotation.copy(euler);
      expect(actual.angleTo(object.quaternion)).toBeLessThan(1e-6); expect(euler.equals(before)).toBe(true);
    }
  });
});
