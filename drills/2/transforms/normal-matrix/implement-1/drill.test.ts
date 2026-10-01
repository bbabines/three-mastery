import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { normalInWorld } from './drill';

describe('transforms.normal-matrix', () => {
  it('turn a face normal from model space into world space on a part with uneven scale, without changing the given normal', () => {
    const parent = new THREE.Group(), part = new THREE.Object3D(); parent.add(part); parent.scale.set(3,1,0.5); parent.rotation.y=0.6; part.rotation.x=0.4;
    const n = new THREE.Vector3(1,1,1).normalize(), before=n.clone();
    const got=answered(normalInWorld(part,n)); part.updateWorldMatrix(true,false);
    const e1=new THREE.Vector3(1,-1,0).applyMatrix3(new THREE.Matrix3().setFromMatrix4(part.matrixWorld));
    const e2=new THREE.Vector3(1,1,-2).applyMatrix3(new THREE.Matrix3().setFromMatrix4(part.matrixWorld));
    expect(Math.abs(got.dot(e1))).toBeLessThan(1e-6); expect(Math.abs(got.dot(e2))).toBeLessThan(1e-6); expect(n.equals(before)).toBe(true);
  });
});
