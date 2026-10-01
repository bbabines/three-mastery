import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { localDelta } from './drill';

describe('rotation.quaternions', () => {
  it('turns around a local axis after the current pose and preserves both inputs', () => {
    const orientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0.7, -0.2));
    const axis = new THREE.Vector3(2, 0, 1);
    const beforePose = orientation.clone(), beforeAxis = axis.clone();
    const expected = orientation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), 0.5));
    expect(answered(localDelta(orientation, axis, 0.5)).angleTo(expected)).toBeLessThan(1e-6);
    expect(orientation.angleTo(beforePose)).toBe(0);
    expect(axis.equals(beforeAxis)).toBe(true);
  });
});
