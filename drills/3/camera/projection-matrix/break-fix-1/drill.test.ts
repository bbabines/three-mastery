import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { viewportLens } from './drill';

describe('camera.projection-matrix', () => {
  it('repairs the reported symptom for a general case', () => {
    for (const [w,h] of [[900,450],[450,900]]) {
      const got=viewportLens(60,w,h,0.2,100), camera=new THREE.PerspectiveCamera(60,w/h,0.2,100);
      for (const point of [new THREE.Vector3(1,0,-5),new THREE.Vector3(0,1,-5)]) expect(point.clone().applyMatrix4(got).distanceTo(point.clone().applyMatrix4(camera.projectionMatrix))).toBeLessThan(1e-6);
    }
  });
});
