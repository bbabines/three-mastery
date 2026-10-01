import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { planeDragPoint } from './drill';

describe('planeDragPoint', () => {
it('hits an angled plane and leaves the ray unchanged', () => {
    const ray = new THREE.Ray(new THREE.Vector3(1, 5, 2), new THREE.Vector3(0.2, -1, 0.1).normalize());
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 1).normalize(), -1); const before = ray.clone();
    expectVector(planeDragPoint(ray, plane), ray.intersectPlane(plane, new THREE.Vector3())!);
    expectUnchanged(ray.origin, before.origin, 'origin'); expectUnchanged(ray.direction, before.direction, 'direction');
  });
  it('uses the origin when a parallel ray misses', () => {
    const ray = new THREE.Ray(new THREE.Vector3(0, 2, 0), new THREE.Vector3(1, 0, 0));
    expectVector(planeDragPoint(ray, new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)), ray.origin);
  });
});
