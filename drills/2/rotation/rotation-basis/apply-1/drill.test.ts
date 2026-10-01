import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cameraRight } from './drill';

describe('rotation.rotation-basis', () => {
  it('read a camera’s right direction from its current world basis, including when the camera looks straight up', () => {
    const parent=new THREE.Group(), camera=new THREE.PerspectiveCamera(); parent.add(camera); parent.rotation.y=0.4;
    for (const pitch of [0,Math.PI/2-0.001,-Math.PI/2+0.001]) {
      camera.rotation.x=pitch; camera.updateWorldMatrix(true,false);
      const expected=new THREE.Vector3(1,0,0).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
      expect(answered(cameraRight(camera)).distanceTo(expected)).toBeLessThan(1e-6);
    }
  });
});
