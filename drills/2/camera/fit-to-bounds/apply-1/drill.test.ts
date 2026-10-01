import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { distanceForRadius, worldPerPixel } from './drill';

describe('camera.fit-to-bounds', () => {
  it('find a camera distance that fits a bounding sphere in both portrait and landscape viewports', () => {
    const radius=2;
    for (const aspect of [0.5,1,2]) {
      const distance=answered(distanceForRadius(radius,60,aspect));
      const camera=new THREE.PerspectiveCamera(60,aspect,0.1,100); camera.position.z=distance;
      const angularRadius=Math.asin(radius/distance);
      const vertical=Math.PI/6, horizontal=Math.atan(Math.tan(vertical)*aspect);
      expect(angularRadius).toBeLessThanOrEqual(Math.min(vertical,horizontal)+1e-6);
    }
    expect(answered(distanceForRadius(2,60,0.5))).toBeGreaterThan(answered(distanceForRadius(2,60,2)));
  });
});

describe('camera.world-size-per-pixel', () => {
  it('keeps a hotspot the same pixel size at different depths', () => {
    const camera = new THREE.PerspectiveCamera(60, 1.5, 0.1, 100);
    const height = 600;
    for (const depth of [2, 5, 20]) {
      const size = answered(worldPerPixel(depth, camera.fov, height));
      const ndcHalf = new THREE.Vector3(0, size / 2, -depth).project(camera).y;
      expect(ndcHalf * height).toBeCloseTo(1, 5);
    }
  });
});
