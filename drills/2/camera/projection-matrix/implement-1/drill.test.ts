import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { lensForViewport } from './drill';

describe('camera.projection-matrix', () => {
  it('build a perspective projection for a vertical field of view and a viewport’s width and height', () => {
    for (const [w,h] of [[800,400],[400,800]]) {
      const matrix=answered(lensForViewport(60,w,h,0.2,100));
      const expected=new THREE.PerspectiveCamera(60,w/h,0.2,100).projectionMatrix;
      for (let i=0;i<16;i++) expect(matrix.elements[i]).toBeCloseTo(expected.elements[i],6);
    }
  });
});
