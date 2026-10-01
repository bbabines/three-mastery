import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { parentDelta } from './drill';

describe('rotation.quaternions', () => {
  it('turns around a parent axis before the current pose and preserves both inputs', () => {
    const orientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0.7, -0.2));
    const axis = new THREE.Vector3(0, 2, 1);
    const beforePose = orientation.clone(), beforeAxis = axis.clone();
    const expected = new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), 0.8).multiply(orientation);
    expect(answered(parentDelta(orientation, axis, 0.8)).angleTo(expected)).toBeLessThan(1e-6);
    expect(orientation.angleTo(beforePose)).toBe(0);
    expect(axis.equals(beforeAxis)).toBe(true);
  });
});
