import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { wallMarkerPoint } from './drill';

describe('wallMarkerPoint', () => {
it('offsets from an angled wall in its own normal direction', () => {
    const wall = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(1, 0, 1).normalize(), new THREE.Vector3(1, 0, 1));
    const ray = new THREE.Ray(new THREE.Vector3(5, 1, 5), new THREE.Vector3(-1, 0, -1).normalize());
    const hit = ray.intersectPlane(wall, new THREE.Vector3())!;
    expectVector(wallMarkerPoint(ray, wall, 0.15), hit.addScaledVector(wall.normal, 0.15));
    expect(wall.normal.length()).toBeCloseTo(1);
  });
});
