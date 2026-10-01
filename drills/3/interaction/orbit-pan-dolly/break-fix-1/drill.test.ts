import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { focusView } from './drill';

describe('interaction.orbit-pan-dolly', () => {
  it('repairs the reported symptom for a general case', () => {
    const camera=new THREE.PerspectiveCamera(); camera.position.set(0,2,5); camera.lookAt(0,0,0); const orbit={target:new THREE.Vector3()}; const center=new THREE.Vector3(3,1,-2);
    focusView(camera,orbit,center,4); expect(orbit.target.distanceTo(center)).toBeLessThan(1e-6); expect(camera.position.distanceTo(center)).toBeCloseTo(4,6);
  });
});
