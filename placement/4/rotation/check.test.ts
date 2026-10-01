import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('rotation.euler-order', () => {
  it('makes the right judgment', () => {
    const q=answered(check.orderedTurn(0.4,0.7,0.2,'YXZ')); expect(q.angleTo(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4,0.7,0.2,'YXZ')))).toBeCloseTo(0);
  });
});

describe('rotation.gimbal-lock', () => {
  it('makes the right judgment', () => {
    const e=new THREE.Euler(Math.PI/2,0.4,0,'YXZ'); expect(answered(check.stableTurn(e)).angleTo(new THREE.Quaternion().setFromEuler(e))).toBeCloseTo(0);
  });
});

describe('rotation.axis-angle', () => {
  it('makes the right judgment', () => {
    const axis=new THREE.Vector3(2,2,0); expect(answered(check.axisTurn(axis,0.7)).angleTo(new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(),0.7))).toBeCloseTo(0);
  });
});

describe('rotation.quaternions', () => {
  it('makes the right judgment', () => {
    const a=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),0.4), b=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7); expect(answered(check.worldDelta(a,b)).angleTo(b.clone().multiply(a))).toBeCloseTo(0);
  });
});

describe('rotation.slerp', () => {
  it('makes the right judgment', () => {
    const a=new THREE.Quaternion(), b=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI); expect(answered(check.halfTurn(a,b)).angleTo(a.clone().slerp(b,0.5))).toBeCloseTo(0);
  });
});

describe('rotation.rotation-basis', () => {
  it('makes the right judgment', () => {
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2); expect(answered(check.forwardAxis(q)).x).toBeCloseTo(1);
  });
});

describe('rotation.lookat-up', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.position.set(1,2,3); const target=new THREE.Vector3(4,2,0), up=new THREE.Vector3(0,0,1); const q=answered(check.aimWithUp(o,target,up)); expect(q.angleTo(o.quaternion)).toBeCloseTo(0); expect(o.up).toEqual(up);
  });
});

describe('rotation.rotate-around-point', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Vector3(2,0,0), pivot=new THREE.Vector3(1,0,0); expect(answered(check.orbitPoint(p,pivot,new THREE.Vector3(0,1,0),Math.PI/2)).z).toBeCloseTo(-1);
  });
});

describe('rotation.converting', () => {
  it('makes the right judgment', () => {
    const e=new THREE.Euler(0.2,0.3,0.4,'ZYX'); expect(answered(check.quaternionFromEuler(e)).angleTo(new THREE.Quaternion().setFromEuler(e))).toBeCloseTo(0);
  });
});
