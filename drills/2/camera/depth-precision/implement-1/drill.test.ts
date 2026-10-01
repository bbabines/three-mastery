import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { depthAt } from './drill';

describe('camera.depth-precision', () => {
  it('measure the depth-buffer value of a surface at a given distance along a perspective camera’s view axis', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,1000);
    const near=answered(depthAt(camera,1)), mid=answered(depthAt(camera,10)), far=answered(depthAt(camera,100));
    expect(near).toBeGreaterThan(0); expect(far).toBeLessThan(1);
    expect(mid-near).toBeGreaterThan(far-mid);
    expect(mid).toBeCloseTo((new THREE.Vector3(0,0,-10).project(camera).z+1)/2,6);
  });
});
