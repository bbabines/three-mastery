import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { inCameraView, boundsHelper } from './drill';

describe('inCameraView', () => {
it('uses world bounds and current camera matrices', () => {
    const camera = new THREE.PerspectiveCamera(60,1,0.1,100); camera.position.z=5; camera.lookAt(0,0,0); camera.updateMatrixWorld();
    const near = new THREE.Mesh(new THREE.BoxGeometry()); expectExact(inCameraView(near,camera),true);
    near.position.x=500; expectExact(inCameraView(near,camera),false);
  });
});

describe('boundsHelper', () => {
it('creates a helper around the supplied object', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry()); mesh.position.set(2,1,-3);
    const helper = answered(boundsHelper(mesh)); expect(helper).toBeInstanceOf(THREE.BoxHelper);
    expect(helper.visible).toBe(true); helper.dispose();
  });
});
