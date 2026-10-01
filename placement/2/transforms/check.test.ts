import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { checkObject3dTour, checkLocalVsWorld, checkMatrixVsMatrixworld, checkUpdateTiming, checkTrsOrder, checkComposeDecompose, checkPointsVsDirections, checkInverseMatrices, checkAddVsAttach, checkPivots, checkNormalMatrix, checkNegativeScale } from './check';

describe('transforms.object3d-tour', () => {
  it('checks object3d tour', () => {
    const a=new THREE.Group(), b=new THREE.Group(), part=new THREE.Object3D(); a.position.set(2,0,1); b.position.set(-3,1,0); a.add(part); part.position.set(1,2,0);
    const before=part.getWorldPosition(new THREE.Vector3()); const after=answered(checkObject3dTour(part,b));
    expect(part.parent).toBe(b); expect(after.distanceTo(before)).toBeLessThan(1e-6);
    expect(part.getWorldPosition(new THREE.Vector3()).distanceTo(before)).toBeLessThan(1e-6);
  });
});

describe('transforms.local-vs-world', () => {
  it('checks local vs world', () => {
    const parent = new THREE.Group(); const part = new THREE.Object3D(); parent.position.set(3, 2, -1); parent.rotation.y = 0.6; part.position.set(1, 0, 2); parent.add(part);
    const offset = new THREE.Vector3(0, 0.5, 1); const before = offset.clone();
    const actual = answered(checkLocalVsWorld(part, offset));
    expect(actual.distanceTo(part.localToWorld(before.clone()))).toBeLessThan(1e-6);
    expect(offset.equals(before)).toBe(true);
  });
});

describe('transforms.matrix-vs-matrixworld', () => {
  it('checks matrix vs matrixworld', () => {
    const parent = new THREE.Group(); const part = new THREE.Object3D(); parent.add(part);
    parent.position.set(4, 2, -3); parent.rotation.y = 0.7; part.position.set(1, 0, 2);
    const actual = answered(checkMatrixVsMatrixworld(part));
    const expected = new THREE.Matrix4().multiplyMatrices(parent.matrixWorld, part.matrix);
    expect(new THREE.Vector3(1, 0, 0).applyMatrix4(actual).distanceTo(new THREE.Vector3(1, 0, 0).applyMatrix4(expected))).toBeLessThan(1e-6);
    expect(actual).not.toBe(part.matrixWorld);
  });
});

describe('transforms.update-timing', () => {
  it('checks update timing', () => {
    const outer = new THREE.Group(); const inner = new THREE.Group(); const part = new THREE.Object3D(); outer.add(inner); inner.add(part);
    outer.position.set(1, 0, 2); inner.rotation.y = 0.7; part.position.x = 2;
    const local = new THREE.Vector3(0.3, 0, 1); const before = local.clone();
    for (const x of [1, 4, -2]) { outer.position.x = x; const actual = answered(checkUpdateTiming(part, local)); expect(actual.distanceTo(part.localToWorld(local.clone()))).toBeLessThan(1e-6); }
    expect(local.equals(before)).toBe(true);
  });
});

describe('transforms.trs-order', () => {
  it('checks trs order', () => {
    const vertex = new THREE.Vector3(1, 2, -1), position = new THREE.Vector3(3, 0, 2), scale = new THREE.Vector3(2, 1, 3);
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.7);
    const actual = answered(checkTrsOrder(vertex, position, rotation, scale));
    const expected = vertex.clone().multiply(scale).applyQuaternion(rotation).add(position);
    expect(actual.distanceTo(expected)).toBeLessThan(1e-6);
    expect(vertex.equals(new THREE.Vector3(1, 2, -1))).toBe(true);
  });
});

describe('transforms.compose-decompose', () => {
  it('checks compose decompose', () => {
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.5);
    for (const scale of [new THREE.Vector3(1,2,3),new THREE.Vector3(-1,2,3),new THREE.Vector3(-1,-2,3)]) {
      const m=new THREE.Matrix4().compose(new THREE.Vector3(2,0,1),q,scale), before=m.clone();
      expect(answered(checkComposeDecompose(m))).toBe(m.determinantAffine()<0); expect(m.equals(before)).toBe(true);
    }
  });
});

describe('transforms.points-vs-directions', () => {
  it('checks points vs directions', () => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(4, 2, -1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.6), new THREE.Vector3(1,1,1));
    const p = new THREE.Vector3(1,0,0), d = new THREE.Vector3(0,0,-2);
    const actual = answered(checkPointsVsDirections(p,d,m));
    expect(actual.point.distanceTo(p.clone().applyMatrix4(m))).toBeLessThan(1e-6);
    expect(actual.direction.distanceTo(d.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(m)).normalize())).toBeLessThan(1e-6);
    expect(p.equals(new THREE.Vector3(1,0,0)) && d.equals(new THREE.Vector3(0,0,-2))).toBe(true);
  });
});

describe('transforms.inverse-matrices', () => {
  it('checks inverse matrices', () => {
    const parent = new THREE.Group(), part = new THREE.Object3D(); parent.add(part); parent.position.set(3,1,-2); parent.rotation.y=0.8; part.scale.set(2,1,0.5);
    const local = new THREE.Vector3(0.4,1,2), world = part.localToWorld(local.clone()), before = world.clone();
    expect(answered(checkInverseMatrices(part,world)).distanceTo(local)).toBeLessThan(1e-6);
    expect(world.equals(before)).toBe(true);
  });
});

describe('transforms.add-vs-attach', () => {
  it('checks add vs attach', () => {
    const a=new THREE.Group(), b=new THREE.Group(), part=new THREE.Object3D(); a.position.x=3; b.position.x=-2; a.add(part); const before=part.getWorldPosition(new THREE.Vector3()); expect(answered(checkAddVsAttach(part,b)).distanceTo(before)).toBeLessThan(1e-6); expect(part.parent).toBe(b);
  });
});

describe('transforms.pivots', () => {
  it('checks pivots', () => {
    const hinge=new THREE.Vector3(3,0,-2), point=new THREE.Vector3(4,1,-2), before=point.clone();
    for (const angle of [0,Math.PI/2,-Math.PI/3]) {
      const expected=point.clone().sub(hinge).applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),angle)).add(hinge);
      expect(answered(checkPivots(hinge,point,angle)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(point.equals(before)).toBe(true);
  });
});

describe('transforms.normal-matrix', () => {
  it('checks normal matrix', () => {
    const parent = new THREE.Group(), part = new THREE.Object3D(); parent.add(part); parent.scale.set(3,1,0.5); parent.rotation.y=0.6; part.rotation.x=0.4;
    const n = new THREE.Vector3(1,1,1).normalize(), before=n.clone();
    const got=answered(checkNormalMatrix(part,n)); part.updateWorldMatrix(true,false);
    const e1=new THREE.Vector3(1,-1,0).applyMatrix3(new THREE.Matrix3().setFromMatrix4(part.matrixWorld));
    const e2=new THREE.Vector3(1,1,-2).applyMatrix3(new THREE.Matrix3().setFromMatrix4(part.matrixWorld));
    expect(Math.abs(got.dot(e1))).toBeLessThan(1e-6); expect(Math.abs(got.dot(e2))).toBeLessThan(1e-6); expect(n.equals(before)).toBe(true);
  });
});

describe('transforms.negative-scale', () => {
  it('checks negative scale', () => {
    expect(answered(checkNegativeScale(new THREE.Matrix4().makeScale(-1,2,3)))).toBe(true); expect(answered(checkNegativeScale(new THREE.Matrix4().makeScale(-1,-2,3)))).toBe(false);
  });
});
