import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { labelState } from './drill';

describe('interaction.anchoring', () => {
  it('repairs the reported symptom for a general case', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,100); camera.position.z=5;
    expect(labelState(camera,new THREE.Vector3(0,0,10),800,800).visible).toBe(false);
    expect(labelState(camera,new THREE.Vector3(0,0,0),800,800).visible).toBe(true);
  });
});
