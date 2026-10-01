import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('camera.view-matrix', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(); c.position.z=5; expect(answered(check.viewPoint(c,new THREE.Vector3())).z).toBeCloseTo(-5);
  });
});

describe('camera.projection-matrix', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(60,1,0.1,100); expect(answered(check.projectedPoint(c,new THREE.Vector3(0,0,-5))).z).toBeCloseTo(new THREE.Vector3(0,0,-5).applyMatrix4(c.projectionMatrix).z);
  });
});

describe('camera.clip-ndc-screen', () => {
  it('makes the right judgment', () => {
    expect(answered(check.screenPosition(new THREE.Vector3(-1,1,0),800,600))).toEqual(new THREE.Vector2(0,0)); expect(answered(check.screenPosition(new THREE.Vector3(1,-1,0),800,600))).toEqual(new THREE.Vector2(800,600));
  });
});

describe('camera.project-unproject', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(60,1,0.1,100); c.position.z=5; expect(answered(check.ndcOf(c,new THREE.Vector3())).x).toBeCloseTo(0);
  });
});

describe('camera.depth-precision', () => {
  it('makes the right judgment', () => {
    expect(answered(check.depthRatio(0.1,1000))).toBeCloseTo(10000); expect(answered(check.depthRatio(1,1000))).toBeCloseTo(1000);
  });
});

describe('camera.frustum', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(60,1,0.1,100); c.position.z=5; expect(answered(check.inCameraFrustum(c,new THREE.Vector3()))).toBe(true); expect(answered(check.inCameraFrustum(c,new THREE.Vector3(100,0,0)))).toBe(false);
  });
});

describe('camera.aspect-resize', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(); expect(answered(check.resizeCamera(c,800,400))).toBe(2); expect(c.projectionMatrix.elements[0]).toBeCloseTo(new THREE.PerspectiveCamera(c.fov,2,c.near,c.far).projectionMatrix.elements[0]);
  });
});

describe('camera.fit-to-bounds', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Object3D(); p.position.x=5; p.add(new THREE.Mesh(new THREE.BoxGeometry(2,2,2))); expect(answered(check.boundsCenter(p)).x).toBeCloseTo(5);
  });
});

describe('camera.world-size-per-pixel', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(90,1,0.1,100); expect(answered(check.unitsPerPixel(c,5,500))).toBeCloseTo(10/500);
  });
});

describe('camera.camera-relative', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(); c.rotation.y=Math.PI/2; expect(answered(check.cameraRight(c)).z).toBeCloseTo(-1);
  });
});
