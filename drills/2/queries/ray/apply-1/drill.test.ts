import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pointAhead, hotspotPoint } from './drill';

describe('pointAhead', () => {
it('uses the ray direction and origin without moving either', () => {
    const ray = new THREE.Ray(new THREE.Vector3(2, 1, -4), new THREE.Vector3(0.6, 0, 0.8));
    const before = ray.clone(); expectVector(pointAhead(ray, 3), ray.at(3, new THREE.Vector3()));
    expectUnchanged(ray.origin, before.origin, 'origin'); expectUnchanged(ray.direction, before.direction, 'direction');
  });
});

describe('hotspotPoint', () => {
it('hits the exit surface from inside and uses the origin on a miss', () => {
    const sphere = new THREE.Sphere(new THREE.Vector3(1, 0, 0), 2);
    const inside = new THREE.Ray(new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0));
    expectVector(hotspotPoint(inside, sphere), inside.intersectSphere(sphere, new THREE.Vector3())!);
    const miss = new THREE.Ray(new THREE.Vector3(0, 5, 0), new THREE.Vector3(1, 0, 0));
    expectVector(hotspotPoint(miss, sphere), miss.origin);
  });
});
