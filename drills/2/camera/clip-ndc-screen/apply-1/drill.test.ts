import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pixelToNdc } from './drill';

describe('camera.clip-ndc-screen', () => {
  it('convert a pointer’s css pixel position into ndc so a ray can be cast through the camera', () => {
    for (const [x,y] of [[0,0],[800,600],[400,300],[100,450]]) {
      const p=answered(pixelToNdc(x,y,800,600));
      const camera=new THREE.PerspectiveCamera(60,800/600,0.1,100);
      const roundTrip=new THREE.Vector3((p.x+1)*400,(1-p.y)*300,0);
      expect(roundTrip.x).toBeCloseTo(x,6); expect(roundTrip.y).toBeCloseTo(y,6);
      expect(p.z).toBe(0);
      expect(Number.isFinite(p.clone().unproject(camera).x)).toBe(true);
    }
  });
});
