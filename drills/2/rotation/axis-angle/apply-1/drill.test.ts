import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { orbitOnAxis } from './drill';

describe('rotation.axis-angle', () => {
  it('rotate a point around a tilted axis through a chosen center, preserving the point and center', () => {
    const point=new THREE.Vector3(4,0,2), center=new THREE.Vector3(1,1,-2), axis=new THREE.Vector3(1,2,1).normalize(), before=point.clone();
    const expected=point.clone().sub(center).applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis,0.7)).add(center);
    expect(answered(orbitOnAxis(point,center,axis,0.7)).distanceTo(expected)).toBeLessThan(1e-6);
    expect(point.equals(before)).toBe(true);
  });
});
