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
  it('captures the fresh full world matrix as an independent snapshot', () => {
    const parent = new THREE.Group(), part = new THREE.Object3D(); parent.add(part);
    parent.position.set(4, 2, -3); parent.rotation.y = 0.7;
    part.position.set(1, 0, 2); part.scale.set(1.5, 0.8, 2);
    const actual = answered(checkMatrixVsMatrixworld(part));
    parent.updateWorldMatrix(true, true);
    const expected = part.matrixWorld.clone();
    for (const probe of [new THREE.Vector3(), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 1)]) {
      expect(probe.clone().applyMatrix4(actual).distanceTo(probe.clone().applyMatrix4(expected))).toBeLessThan(1e-6);
    }
    expect(actual).not.toBe(part.matrixWorld);
    parent.position.x += 3; parent.updateWorldMatrix(true, true);
    expect(actual.equals(expected)).toBe(true);
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
  it('places a vertex in TRS order while preserving all inputs', () => {
    const vertex = new THREE.Vector3(1, 2, -1), position = new THREE.Vector3(3, 0, 2);
    const scale = new THREE.Vector3(2, 1, 3);
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.7);
    const beforeVertex = vertex.clone(), beforePosition = position.clone();
    const beforeScale = scale.clone(), beforeRotation = rotation.clone();
    const expected = vertex.clone().multiply(scale).applyQuaternion(rotation).add(position);
    expect(answered(checkTrsOrder(vertex, position, rotation, scale)).distanceTo(expected)).toBeLessThan(1e-6);
    expect(vertex.equals(beforeVertex) && position.equals(beforePosition) && scale.equals(beforeScale) && rotation.equals(beforeRotation)).toBe(true);
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
  it('moves a ray origin with translation and its aim without translation or scale length', () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(4, 2, -1),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.6), new THREE.Vector3(2, 0.7, 1.5));
    const point = new THREE.Vector3(1, 0.3, -0.4), direction = new THREE.Vector3(0.3, 0.2, -2);
    const beforePoint = point.clone(), beforeDirection = direction.clone(), beforeMatrix = matrix.clone();
    const actual = answered(checkPointsVsDirections(point, direction, matrix));
    expect(actual.point.distanceTo(point.clone().applyMatrix4(matrix))).toBeLessThan(1e-6);
    expect(actual.direction.distanceTo(direction.clone().transformDirection(matrix))).toBeLessThan(1e-6);
    expect(actual.direction.length()).toBeCloseTo(1, 6);
    expect(point.equals(beforePoint) && direction.equals(beforeDirection) && matrix.equals(beforeMatrix)).toBe(true);
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
  it('reparents without changing the part’s world location', () => {
    const oldParent = new THREE.Group(), newParent = new THREE.Group(), part = new THREE.Object3D();
    oldParent.position.set(3, 1, 0); oldParent.rotation.y = 0.5;
    newParent.position.set(-2, 0, 1); newParent.rotation.y = -0.7;
    oldParent.add(part); part.position.set(0.4, 0.3, 0.8);
    const before = part.getWorldPosition(new THREE.Vector3());
    const result = answered(checkAddVsAttach(part, newParent));
    expect(result.distanceTo(before)).toBeLessThan(1e-6);
    expect(part.parent).toBe(newParent);
    expect(part.getWorldPosition(new THREE.Vector3()).distanceTo(before)).toBeLessThan(1e-6);
  });
});

describe('transforms.pivots', () => {
  it('swings around an offset hinge in both directions without changing the points', () => {
    const hinge = new THREE.Vector3(3, 0, -2), point = new THREE.Vector3(4, 1, -2);
    const beforeHinge = hinge.clone(), beforePoint = point.clone();
    for (const angle of [0, Math.PI / 2, -Math.PI / 3]) {
      const expected = point.clone().sub(hinge).applyQuaternion(
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle),
      ).add(hinge);
      expect(answered(checkPivots(hinge, point, angle)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(hinge.equals(beforeHinge) && point.equals(beforePoint)).toBe(true);
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
