import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveRay } from './drill';

describe('transforms.points-vs-directions', () => {
  it('move a ray from model space into world space: its point moves with translation, while its direction does not', () => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(4, 2, -1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.6), new THREE.Vector3(1,1,1));
    const p = new THREE.Vector3(1,0,0), d = new THREE.Vector3(0,0,-2);
    const actual = answered(moveRay(p,d,m));
    expect(actual.point.distanceTo(p.clone().applyMatrix4(m))).toBeLessThan(1e-6);
    expect(actual.direction.distanceTo(d.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(m)).normalize())).toBeLessThan(1e-6);
    expect(p.equals(new THREE.Vector3(1,0,0)) && d.equals(new THREE.Vector3(0,0,-2))).toBe(true);
  });
});
