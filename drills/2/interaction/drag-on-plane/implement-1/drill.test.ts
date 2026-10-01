import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { planeDragLocal } from './drill';

describe('planeDragLocal', () => {
it('keeps the offset under a rotated and translated parent', () => {
    const parent = new THREE.Group(); parent.position.set(2,1,-1); parent.rotation.y = 0.5;
    const child = new THREE.Mesh(); child.position.set(0.4,0,0.2); parent.add(child); parent.updateMatrixWorld(true);
    const plane = new THREE.Plane(new THREE.Vector3(0,1,0),0);
    const ray = new THREE.Ray(new THREE.Vector3(3,4,2),new THREE.Vector3(0,-1,0));
    const offset = new THREE.Vector3(0.7,0,0.2); const before = offset.clone();
    const world = ray.intersectPlane(plane,new THREE.Vector3())!.add(offset);
    expectVector(planeDragLocal(ray,plane,offset,child),parent.worldToLocal(world));
    expectUnchanged(offset,before,'offset'); expectVector(child.position,new THREE.Vector3(0.4,0,0.2));
  });
});
