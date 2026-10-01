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
  it('takes the shortest quaternion arc through a steep camera turn', () => {
    const start = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.4, 2.9, 0.2, 'YXZ'));
    const end = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, -2.8, -0.2, 'YXZ'));
    const beforeStart = start.clone(), beforeEnd = end.clone();
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
      const actual = answered(checkGimbalLock(start, end, fraction));
      const expected = start.clone().slerp(end, fraction);
      expect(actual.angleTo(expected)).toBeLessThan(1e-6);
    }
    expect(start.equals(beforeStart)).toBe(true);
    expect(end.equals(beforeEnd)).toBe(true);
  });
});

describe('rotation.axis-angle', () => {
  it('turns around an off-center, tilted hinge without changing any input', () => {
    const point = new THREE.Vector3(4, 0, 2);
    const center = new THREE.Vector3(1, 1, -2);
    const axis = new THREE.Vector3(1, 2, 1);
    const before = [point.clone(), center.clone(), axis.clone()];
    for (const angle of [0.7, -0.4]) {
      const expected = point.clone().sub(center).applyQuaternion(
        new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), angle),
      ).add(center);
      expect(answered(checkAxisAngle(point, center, axis, angle)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(point.equals(before[0]) && center.equals(before[1]) && axis.equals(before[2])).toBe(true);
  });
});

describe('rotation.quaternions', () => {
  it('turns around a local axis after the current pose and preserves both inputs', () => {
    const orientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0.7, -0.2));
    const axis = new THREE.Vector3(2, 0, 1);
    const beforePose = orientation.clone(), beforeAxis = axis.clone();
    const expected = orientation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), 0.5));
    expect(answered(checkQuaternions(orientation, axis, 0.5)).angleTo(expected)).toBeLessThan(1e-6);
    expect(orientation.angleTo(beforePose)).toBe(0);
    expect(axis.equals(beforeAxis)).toBe(true);
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
  it('aims ordinary +Z with a tilted up without changing inputs', () => {
    const from = new THREE.Vector3(2, 1, 3);
    const target = new THREE.Vector3(-1, 2, 0);
    const up = new THREE.Vector3(1, 2, -0.5);
    const before = [from.clone(), target.clone(), up.clone()];
    const expected = new THREE.Object3D();
    expected.position.copy(from); expected.up.copy(up); expected.lookAt(target);
    const actual = answered(checkLookatUp(from, target, up));
    expect(actual.angleTo(expected.quaternion)).toBeLessThan(1e-6);
    expect(from.equals(before[0]) && target.equals(before[1]) && up.equals(before[2])).toBe(true);
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
