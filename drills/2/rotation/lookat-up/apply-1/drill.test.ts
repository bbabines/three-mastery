import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cameraAim } from './drill';

describe('rotation.lookat-up', () => {
  it('aim a camera’s −z at a target, respecting the chosen up vector and keeping the input positions intact', () => {
    const from=new THREE.Vector3(1,4,5), target=new THREE.Vector3(-2,0,1), up=new THREE.Vector3(0,1,0); const before=target.clone();
    const q=answered(cameraAim(from,target,up));
    expect(new THREE.Vector3(0,0,-1).applyQuaternion(q).angleTo(target.clone().sub(from))).toBeLessThan(1e-6);
    expect(target.equals(before)).toBe(true);
    const object=answered(cameraAim(from,target,new THREE.Vector3(1,1,0).normalize())); expect(object.angleTo(q)).toBeGreaterThan(0.01);
  });
});
