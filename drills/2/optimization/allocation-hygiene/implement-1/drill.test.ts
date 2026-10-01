import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { closestInto } from './drill';

describe('closestInto', () => {
it('uses the caller scratch object on repeated queries', () => {
    const ray=new THREE.Ray(new THREE.Vector3(1,2,3),new THREE.Vector3(1,0,0)); const point=new THREE.Vector3(4,5,6), scratch=new THREE.Vector3();
    const result=answered(closestInto(ray,point,scratch)); expect(result).toBe(scratch);
    expectVector(result,ray.closestPointToPoint(point,new THREE.Vector3()));
    expect(answered(closestInto(ray,new THREE.Vector3(0,0,0),scratch))).toBe(scratch);
    expectUnchanged(point,new THREE.Vector3(4,5,6),'point');
  });
});
