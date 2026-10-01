import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { parentDelta } from './drill';

describe('rotation.quaternions', () => {
  it('apply a turn around an axis measured in the parent’s frame, preserving the current orientation', () => {
    const orientation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),0.6);
    const axis=new THREE.Vector3(0,1,0), before=orientation.clone();
    const expected=new THREE.Quaternion().setFromAxisAngle(axis,0.8).multiply(orientation);
    expect(answered(parentDelta(orientation,axis,0.8)).angleTo(expected)).toBeLessThan(1e-6);
    expect(orientation.angleTo(before)).toBe(0);
  });
});
