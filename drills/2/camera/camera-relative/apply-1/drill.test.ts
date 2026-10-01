import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { screenAxes } from './drill';

describe('camera.camera-relative', () => {
  it('read the world directions of a camera’s screen right, screen up, and forward, even when it looks straight up', () => {
    const camera=new THREE.PerspectiveCamera(); camera.rotation.set(Math.PI/2,0.5,0,'YXZ');
    const axes=answered(screenAxes(camera)); camera.updateMatrixWorld();
    expect(axes.right.distanceTo(new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion))).toBeLessThan(1e-6);
    expect(axes.up.distanceTo(new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion))).toBeLessThan(1e-6);
    expect(axes.forward.distanceTo(new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion))).toBeLessThan(1e-6);
  });
});
