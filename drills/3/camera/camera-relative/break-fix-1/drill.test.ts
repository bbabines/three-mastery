import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cameraRight } from './drill';

describe('camera.camera-relative', () => {
  it('repairs the reported symptom for a general case', () => {
    const c=new THREE.PerspectiveCamera(); c.rotation.x=Math.PI/2; c.updateMatrixWorld();
    const got=cameraRight(c), expected=new THREE.Vector3(1,0,0).applyQuaternion(c.quaternion);
    expect(got.length()).toBeCloseTo(1,6); expect(got.distanceTo(expected)).toBeLessThan(1e-6);
  });
});
