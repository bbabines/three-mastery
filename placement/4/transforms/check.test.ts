import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('transforms.object3d-tour', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Object3D(), c=new THREE.Object3D(); expect(answered(check.makeHierarchy(p,c))).toBe(p); expect(c.parent).toBe(p);
  });
});

describe('transforms.local-vs-world', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.position.set(2,0,0); expect(answered(check.worldPoint(o,new THREE.Vector3(1,0,0))).x).toBeCloseTo(3);
  });
});

describe('transforms.matrix-vs-matrixworld', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Object3D(), c=new THREE.Object3D(); p.position.x=3; c.position.x=2; p.add(c); expect(answered(check.worldTranslation(c)).x).toBeCloseTo(5);
  });
});

describe('transforms.update-timing', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Object3D(), c=new THREE.Object3D(); p.position.x=2; p.add(c); expect(answered(check.movedWorldPoint(c,new THREE.Vector3(3,0,0))).x).toBeCloseTo(5);
  });
});

describe('transforms.trs-order', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Vector3(1,0,0), q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2); expect(answered(check.pointAfterTrs(p,new THREE.Vector3(2,0,0),q,new THREE.Vector3(2,1,1))).x).toBeCloseTo(2);
  });
});

describe('transforms.compose-decompose', () => {
  it('makes the right judgment', () => {
    const m=new THREE.Matrix4().compose(new THREE.Vector3(2,3,4),new THREE.Quaternion(),new THREE.Vector3(2,1,1)); expect(answered(check.translationOf(m))).toEqual(new THREE.Vector3(2,3,4));
  });
});

describe('transforms.points-vs-directions', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.position.x=10; o.rotation.y=Math.PI/2; expect(answered(check.worldDirection(o,new THREE.Vector3(0,0,1))).x).toBeCloseTo(1);
  });
});

describe('transforms.inverse-matrices', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.position.x=5; expect(answered(check.localPoint(o,new THREE.Vector3(6,0,0))).x).toBeCloseTo(1);
  });
});

describe('transforms.add-vs-attach', () => {
  it('makes the right judgment', () => {
    const a=new THREE.Object3D(), b=new THREE.Object3D(), c=new THREE.Object3D(); a.position.x=2; b.position.x=8; a.add(c); const before=c.getWorldPosition(new THREE.Vector3()); answered(check.keepWorldOnReparent(c,b)); expect(c.getWorldPosition(new THREE.Vector3()).x).toBeCloseTo(before.x);
  });
});

describe('transforms.pivots', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.pivot=new THREE.Vector3(1,0,0); o.rotation.y=Math.PI/2; expect(answered(check.pivotedOrigin(o)).distanceTo(new THREE.Vector3())).toBeGreaterThan(0.5);
  });
});

describe('transforms.normal-matrix', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.scale.set(3,1,0.5); const n=new THREE.Vector3(1,0,1).normalize(); expect(answered(check.normalInWorld(o,n))).toEqual(n.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(o.matrixWorld)).normalize());
  });
});

describe('transforms.negative-scale', () => {
  it('makes the right judgment', () => {
    expect(answered(check.reversesHandedness(new THREE.Matrix4().makeScale(-1,1,1)))).toBe(true); expect(answered(check.reversesHandedness(new THREE.Matrix4().makeScale(2,1,1)))).toBe(false);
  });
});
