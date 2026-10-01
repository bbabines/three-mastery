import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldArrowDirection, finiteOrZero } from './drill';

describe('worldArrowDirection', () => {
it('uses the object world rotation and leaves the local vector alone', () => {
    const parent = new THREE.Group(); parent.rotation.y=0.6; const child = new THREE.Group(); child.rotation.z=0.3; parent.add(child);
    const local = new THREE.Vector3(2,0,0); const before=local.clone();
    expectVector(worldArrowDirection(child,local),local.clone().normalize().applyQuaternion(child.getWorldQuaternion(new THREE.Quaternion())));
    expectUnchanged(local,before,'local direction');
  });
});

describe('finiteOrZero', () => {
it('does not let a NaN spread into helper geometry', () => {
    const bad = new THREE.Vector3(Number.NaN,2,3); expectVector(finiteOrZero(bad),new THREE.Vector3());
    const good = new THREE.Vector3(1,2,3); expectVector(finiteOrZero(good),good); expect(good.toArray()).toEqual([1,2,3]);
  });
});
