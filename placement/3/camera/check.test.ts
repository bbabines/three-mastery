import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { checkViewMatrix, checkProjectionMatrix, checkClipNdcScreen, checkProjectUnproject, checkDepthPrecision, checkFrustum, checkAspectResize, checkFitToBounds, checkWorldSizePerPixel, checkCameraRelative } from './check';

describe('camera.view-matrix', () => {
  it('checks view matrix', () => {
    const parent=new THREE.Group(), camera=new THREE.PerspectiveCamera(); parent.add(camera); parent.position.set(1,0,2); camera.position.set(2,3,5); camera.lookAt(0,0,0);
    const world=new THREE.Vector3(4,1,-1), before=world.clone();
    const result=answered(checkViewMatrix(camera,world)); camera.updateWorldMatrix(true,false);
    expect(result.clone().applyMatrix4(camera.matrixWorld).distanceTo(world)).toBeLessThan(1e-6);
    expect(world.equals(before)).toBe(true);
  });
});

describe('camera.projection-matrix', () => {
  it('checks projection matrix', () => {
    for (const [w,h] of [[800,400],[400,800]]) {
      const matrix=answered(checkProjectionMatrix(60,w,h,0.2,100));
      const expected=new THREE.PerspectiveCamera(60,w/h,0.2,100).projectionMatrix;
      for (let i=0;i<16;i++) expect(matrix.elements[i]).toBeCloseTo(expected.elements[i],6);
    }
  });
});

describe('camera.clip-ndc-screen', () => {
  it('checks clip ndc screen', () => {
    const ndc=new THREE.Vector3(0.25,-0.5,0.2), before=ndc.clone();
    const p=answered(checkClipNdcScreen(ndc,800,600));
    expect(p.distanceTo(new THREE.Vector3(500,450,0.2))).toBeLessThan(1e-6);
    expect(answered(checkClipNdcScreen(new THREE.Vector3(-1,1,0),800,600)).distanceTo(new THREE.Vector3(0,0,0))).toBeLessThan(1e-6);
    expect(ndc.equals(before)).toBe(true);
  });
});

describe('camera.project-unproject', () => {
  it('checks project unproject', () => {
    const camera=new THREE.PerspectiveCamera(60,800/600,0.1,100); camera.position.set(2,1,5); camera.lookAt(0,0,0); const p=new THREE.Vector3(1,0,0), before=p.clone();
    const screen=answered(checkProjectUnproject(camera,p,800,600));
    const ndc=new THREE.Vector3(2*screen.x/800-1,1-2*screen.y/600,screen.z);
    expect(ndc.unproject(camera).distanceTo(p)).toBeLessThan(1e-5);
    expect(p.equals(before)).toBe(true);
  });
});

describe('camera.depth-precision', () => {
  it('checks depth precision', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,1000);
    const near=answered(checkDepthPrecision(camera,1)), mid=answered(checkDepthPrecision(camera,10)), far=answered(checkDepthPrecision(camera,100));
    expect(near).toBeGreaterThan(0); expect(far).toBeLessThan(1);
    expect(mid-near).toBeGreaterThan(far-mid);
    expect(mid).toBeCloseTo((new THREE.Vector3(0,0,-10).project(camera).z+1)/2,6);
  });
});

describe('camera.frustum', () => {
  it('checks frustum', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,100); camera.position.z=5;
    const edge=new THREE.Vector3(3,0,0);
    expect(answered(checkFrustum(camera,800,400,edge))).toBe(true);
    expect(answered(checkFrustum(camera,400,800,edge))).toBe(false);
    expect(camera.aspect).toBe(0.5);
  });
});

describe('camera.aspect-resize', () => {
  it('checks aspect resize', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,100); const before=camera.projectionMatrix.clone(); expect(answered(checkAspectResize(camera,400,800))).toBeCloseTo(0.5); expect(camera.projectionMatrix.equals(before)).toBe(false);
  });
});

describe('camera.fit-to-bounds', () => {
  it('checks fit to bounds', () => {
    const radius=2;
    for (const aspect of [0.5,1,2]) {
      const distance=answered(checkFitToBounds(radius,60,aspect));
      const camera=new THREE.PerspectiveCamera(60,aspect,0.1,100); camera.position.z=distance;
      const angularRadius=Math.asin(radius/distance);
      const vertical=Math.PI/6, horizontal=Math.atan(Math.tan(vertical)*aspect);
      expect(angularRadius).toBeLessThanOrEqual(Math.min(vertical,horizontal)+1e-6);
    }
    expect(answered(checkFitToBounds(2,60,0.5))).toBeGreaterThan(answered(checkFitToBounds(2,60,2)));
  });
});

describe('camera.world-size-per-pixel', () => {
  it('checks world size per pixel', () => {
    const camera=new THREE.PerspectiveCamera(60,1,0.1,100); const span=answered(checkWorldSizePerPixel(5,camera.fov,600)); expect(new THREE.Vector3(0,span/2,-5).project(camera).y*600).toBeCloseTo(1,5);
  });
});

describe('camera.camera-relative', () => {
  it('checks camera relative', () => {
    const camera=new THREE.PerspectiveCamera(); camera.rotation.set(Math.PI/2,0.5,0,'YXZ');
    const axes=answered(checkCameraRelative(camera)); camera.updateMatrixWorld();
    expect(axes.right.distanceTo(new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion))).toBeLessThan(1e-6);
    expect(axes.up.distanceTo(new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion))).toBeLessThan(1e-6);
    expect(axes.forward.distanceTo(new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion))).toBeLessThan(1e-6);
  });
});
