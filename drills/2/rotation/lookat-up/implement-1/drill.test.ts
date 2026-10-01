import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { aimWithUp } from './drill';

describe('rotation.lookat-up', () => {
  it('aim an ordinary object’s +z at a target while keeping its +y as close as possible to a given up direction', () => {
    const from=new THREE.Vector3(2,1,3), target=new THREE.Vector3(-1,2,0), up=new THREE.Vector3(0,1,0); const before=from.clone();
    const q=answered(aimWithUp(from,target,up));
    expect(new THREE.Vector3(0,0,1).applyQuaternion(q).angleTo(target.clone().sub(from))).toBeLessThan(1e-6);
    expect(from.equals(before)).toBe(true);
    const q2=answered(aimWithUp(from,target,new THREE.Vector3(1,1,0).normalize()));
    expect(q2.angleTo(q)).toBeGreaterThan(0.01);
  });
});
