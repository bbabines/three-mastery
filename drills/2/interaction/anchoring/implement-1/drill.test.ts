import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { labelPosition } from './drill';

describe('labelPosition', () => {
it('places a front point in CSS pixels and hides one behind', () => {
    const camera = new THREE.PerspectiveCamera(60,2,0.1,100); camera.position.set(0,0,5); camera.lookAt(0,0,0); camera.updateMatrixWorld();
    const rect = {left:80,top:40,width:600,height:300}; const front = answered(labelPosition(new THREE.Vector3(0,0,0),camera,rect));
    expect(front.x).toBeCloseTo(380); expect(front.y).toBeCloseTo(190); expect(front.visible).toBe(true);
    expect(answered(labelPosition(new THREE.Vector3(0,0,10),camera,rect)).visible).toBe(false);
  });
});
