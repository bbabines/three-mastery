import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { localDelta } from './drill';

describe('rotation.quaternions', () => {
  it('apply a turn around an object’s own axis to its current orientation without changing either input', () => {
    const orientation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7);
    const axis=new THREE.Vector3(1,0,0), before=orientation.clone();
    const actual=answered(localDelta(orientation,axis,0.5));
    const expected=new THREE.Object3D(); expected.quaternion.copy(orientation); expected.rotateOnAxis(axis,0.5);
    expect(actual.angleTo(expected.quaternion)).toBeLessThan(1e-6); expect(orientation.angleTo(before)).toBe(0);
  });
});
