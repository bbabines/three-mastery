import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { depthBufferValue } from './drill';

describe('camera.depth-precision', () => {
  it('repairs the reported symptom for a general case', () => {
    const near=depthBufferValue(0.1,1000,1), middle=depthBufferValue(0.1,1000,10), far=depthBufferValue(0.1,1000,100);
    expect(middle-near).toBeGreaterThan(far-middle);
    const c=new THREE.PerspectiveCamera(60,1,0.1,1000); expect(middle).toBeCloseTo((new THREE.Vector3(0,0,-10).project(c).z+1)/2,6);
  });
});
