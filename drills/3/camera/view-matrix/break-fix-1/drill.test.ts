import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldToView } from './drill';

describe('camera.view-matrix', () => {
  it('repairs the reported symptom for a general case', () => {
    const camera=new THREE.PerspectiveCamera(); camera.position.set(2,1,5); camera.lookAt(0,0,0); const p=new THREE.Vector3(1,0,-2), before=p.clone();
    const got=worldToView(camera,p), expected=p.clone().applyMatrix4(camera.matrixWorldInverse);
    expect(got.distanceTo(expected)).toBeLessThan(1e-6); expect(p.equals(before)).toBe(true);
  });
});
