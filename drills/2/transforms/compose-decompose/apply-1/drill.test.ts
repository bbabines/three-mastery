import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { isMirroredPose } from './drill';

describe('transforms.compose-decompose', () => {
  it('inspect a saved transform from an imported part and report whether its scale mirrors the part', () => {
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.5);
    for (const scale of [new THREE.Vector3(1,2,3),new THREE.Vector3(-1,2,3),new THREE.Vector3(-1,-2,3)]) {
      const m=new THREE.Matrix4().compose(new THREE.Vector3(2,0,1),q,scale), before=m.clone();
      expect(answered(isMirroredPose(m))).toBe(m.determinantAffine()<0); expect(m.equals(before)).toBe(true);
    }
  });
});
