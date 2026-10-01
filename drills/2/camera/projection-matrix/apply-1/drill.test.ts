import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { orthoForBox } from './drill';

describe('camera.projection-matrix', () => {
  it('build an orthographic lens that maps a chosen world-space box into the picture without perspective shrinking', () => {
    const lens=answered(orthoForBox(-3,5,4,-2,0.1,30));
    const camera=new THREE.OrthographicCamera(-3,5,4,-2,0.1,30);
    for (const point of [new THREE.Vector3(-3,4,-5),new THREE.Vector3(5,-2,-5)]) {
      const expected=point.clone().applyMatrix4(camera.projectionMatrix);
      expect(point.clone().applyMatrix4(lens).distanceTo(expected)).toBeLessThan(1e-6);
    }
  });
});
