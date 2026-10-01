import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pointAtNdcDepth } from './drill';

describe('camera.project-unproject', () => {
  it('unproject a chosen ndc spot and depth into a world point, updating the camera after a move', () => {
    const camera=new THREE.PerspectiveCamera(60,1.5,0.2,100); camera.position.set(2,1,5); camera.lookAt(0,0,0);
    for (const depth of [-0.6,0,0.8]) {
      const world=answered(pointAtNdcDepth(camera,0.25,-0.4,depth));
      const ndc=world.clone().project(camera);
      expect(ndc.distanceTo(new THREE.Vector3(0.25,-0.4,depth))).toBeLessThan(1e-5);
    }
  });
});
