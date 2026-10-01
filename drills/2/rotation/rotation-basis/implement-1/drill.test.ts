import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { forwardFromBasis } from './drill';

describe('rotation.rotation-basis', () => {
  it('read an ordinary object’s forward direction from a rotated and scaled basis matrix, returning a unit world direction', () => {
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7);
    const matrix=new THREE.Matrix4().compose(new THREE.Vector3(2,1,0),q,new THREE.Vector3(2,3,4));
    const before=matrix.clone(); const actual=answered(forwardFromBasis(matrix));
    expect(actual.distanceTo(new THREE.Vector3(0,0,1).applyQuaternion(q))).toBeLessThan(1e-6);
    expect(matrix.equals(before)).toBe(true);
  });
});
