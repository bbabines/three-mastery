import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldVelocity } from './drill';

describe('transforms.points-vs-directions', () => {
  it('convert a velocity into world space, keeping the effect of scale on its speed but ignoring translation', () => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(10,0,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.8), new THREE.Vector3(2,1,0.5));
    const v = new THREE.Vector3(1,2,3); const before = v.clone();
    const actual = answered(worldVelocity(v,m));
    const expected = new THREE.Vector3().subVectors(v.clone().applyMatrix4(m), new THREE.Vector3().applyMatrix4(m));
    expect(actual.distanceTo(expected)).toBeLessThan(1e-6); expect(v.equals(before)).toBe(true);
  });
});
