import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldToView } from './drill';

describe('camera.view-matrix', () => {
  it('turn a world point into a camera-space point using the current inverse camera transform', () => {
    const parent=new THREE.Group(), camera=new THREE.PerspectiveCamera(); parent.add(camera); parent.position.set(1,0,2); camera.position.set(2,3,5); camera.lookAt(0,0,0);
    const world=new THREE.Vector3(4,1,-1), before=world.clone();
    const result=answered(worldToView(camera,world)); camera.updateWorldMatrix(true,false);
    expect(result.clone().applyMatrix4(camera.matrixWorld).distanceTo(world)).toBeLessThan(1e-6);
    expect(world.equals(before)).toBe(true);
  });
});
