import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleAfterResize } from './drill';

describe('camera.frustum', () => {
  it('resize a perspective camera’s lens and tell whether a world point lies inside its new view frustum', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,100); camera.position.z=5;
    const edge=new THREE.Vector3(3,0,0);
    expect(answered(visibleAfterResize(camera,800,400,edge))).toBe(true);
    expect(answered(visibleAfterResize(camera,400,800,edge))).toBe(false);
    expect(camera.aspect).toBe(0.5);
  });
});
