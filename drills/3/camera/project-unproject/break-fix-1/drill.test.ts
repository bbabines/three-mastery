import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { labelVisible } from './drill';

describe('camera.project-unproject', () => {
  it('repairs the reported symptom for a general case', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,100); camera.position.set(0,0,5);
    expect(labelVisible(camera,new THREE.Vector3(0,0,0))).toBe(true);
    expect(labelVisible(camera,new THREE.Vector3(0,0,10))).toBe(false);
    expect(labelVisible(camera,new THREE.Vector3(20,0,0))).toBe(false);
  });
});
