import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleAfterResize } from './drill';

describe('camera.frustum', () => {
  it('repairs the reported symptom for a general case', () => {
    const c=new THREE.PerspectiveCamera(60,2,0.1,100); c.position.z=5; const p=new THREE.Vector3(3,0,0);
    expect(visibleAfterResize(c,800,400,p)).toBe(true); expect(visibleAfterResize(c,400,800,p)).toBe(false);
    expect(p).toEqual(new THREE.Vector3(3,0,0));
  });
});
