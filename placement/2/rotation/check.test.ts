import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { checkEulerOrder, checkGimbalLock, checkAxisAngle, checkQuaternions, checkSlerp, checkRotationBasis, checkLookatUp, checkRotateAroundPoint, checkConverting } from './check';

describe('rotation.euler-order', () => {
  it('checks euler order', () => {
    const angles=new THREE.Vector3(0.6,0.9,-0.3), before=angles.clone();
    for (const order of ['XYZ','YXZ','ZXY'] as THREE.EulerOrder[]) {
      const expected=new THREE.Object3D(); expected.rotation.set(angles.x,angles.y,angles.z,order);
      expect(answered(checkEulerOrder(angles,order)).angleTo(expected.quaternion)).toBeLessThan(1e-6);
    }
    expect(angles.equals(before)).toBe(true);
  });
});

describe('rotation.gimbal-lock', () => {
  it('checks gimbal lock', () => {
    const a=new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2,2.9,0,'YXZ'));
    const b=new THREE.Quaternion().setFromEuler(new THREE.Euler(1.4,-2.9,0,'YXZ'));
    const before=a.clone();
    for (const t of [0,0.25,0.5,0.75,1]) {
      const actual=answered(checkGimbalLock(a,b,t)); const expected=a.clone().slerp(b,t);
      expect(actual.angleTo(expected)).toBeLessThan(1e-6);
    }
    expect(a.angleTo(before)).toBeLessThan(1e-6);
  });
});

describe('rotation.axis-angle', () => {
  it('checks axis angle', () => {
    const point=new THREE.Vector3(4,0,2), center=new THREE.Vector3(1,1,-2), axis=new THREE.Vector3(1,2,1).normalize(), before=point.clone();
    const expected=point.clone().sub(center).applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis,0.7)).add(center);
    expect(answered(checkAxisAngle(point,center,axis,0.7)).distanceTo(expected)).toBeLessThan(1e-6);
    expect(point.equals(before)).toBe(true);
  });
});

describe('rotation.quaternions', () => {
  it('checks quaternions', () => {
    const orientation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7);
    const axis=new THREE.Vector3(1,0,0), before=orientation.clone();
    const actual=answered(checkQuaternions(orientation,axis,0.5));
    const expected=new THREE.Object3D(); expected.quaternion.copy(orientation); expected.rotateOnAxis(axis,0.5);
    expect(actual.angleTo(expected.quaternion)).toBeLessThan(1e-6); expect(orientation.angleTo(before)).toBe(0);
  });
});

describe('rotation.slerp', () => {
  it('checks slerp', () => {
    const a=new THREE.Quaternion(), b=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),2); expect(answered(checkSlerp(a,b,0.5)).angleTo(a.clone().slerp(b,0.5))).toBeLessThan(1e-6); expect(a.angleTo(new THREE.Quaternion())).toBe(0);
  });
});

describe('rotation.rotation-basis', () => {
  it('checks rotation basis', () => {
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7);
    const matrix=new THREE.Matrix4().compose(new THREE.Vector3(2,1,0),q,new THREE.Vector3(2,3,4));
    const before=matrix.clone(); const actual=answered(checkRotationBasis(matrix));
    expect(actual.distanceTo(new THREE.Vector3(0,0,1).applyQuaternion(q))).toBeLessThan(1e-6);
    expect(matrix.equals(before)).toBe(true);
  });
});

describe('rotation.lookat-up', () => {
  it('checks lookat up', () => {
    const from=new THREE.Vector3(2,1,3), target=new THREE.Vector3(-1,2,0), up=new THREE.Vector3(0,1,0); const before=from.clone();
    const q=answered(checkLookatUp(from,target,up));
    expect(new THREE.Vector3(0,0,1).applyQuaternion(q).angleTo(target.clone().sub(from))).toBeLessThan(1e-6);
    expect(from.equals(before)).toBe(true);
    const q2=answered(checkLookatUp(from,target,new THREE.Vector3(1,1,0).normalize()));
    expect(q2.angleTo(q)).toBeGreaterThan(0.01);
  });
});

describe('rotation.rotate-around-point', () => {
  it('checks rotate around point', () => {
    const p=new THREE.Vector3(3,0,0), c=new THREE.Vector3(2,0,0), q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2); expect(answered(checkRotateAroundPoint(p,c,q)).distanceTo(new THREE.Vector3(2,0,-1))).toBeLessThan(1e-6);
  });
});

describe('rotation.converting', () => {
  it('checks converting', () => {
    for (const euler of [new THREE.Euler(0.4,1.2,-0.7,'ZYX'),new THREE.Euler(1.5,0.8,2.1,'YXZ')]) {
      const before=euler.clone(), actual=answered(checkConverting(euler));
      const object=new THREE.Object3D(); object.rotation.copy(euler);
      expect(actual.angleTo(object.quaternion)).toBeLessThan(1e-6); expect(euler.equals(before)).toBe(true);
    }
  });
});
