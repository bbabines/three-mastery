import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { frontFacePoint } from './drill';

describe('frontFacePoint', () => {
it('hits the front but rejects the back of a sloped triangle', () => {
    const a = new THREE.Vector3(-1, -1, 0), b = new THREE.Vector3(1, -1, 0), c = new THREE.Vector3(0, 1, 1);
    const front = new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
    const before = front.clone();
    expectVector(frontFacePoint(front, a, b, c), front.intersectTriangle(a, b, c, true, new THREE.Vector3())!);
    expectUnchanged(front.origin, before.origin, 'ray origin');
    expectUnchanged(front.direction, before.direction, 'ray direction');
    const back = new THREE.Ray(new THREE.Vector3(0, 0, -5), new THREE.Vector3(0, 0, 1));
    expectVector(frontFacePoint(back, a, b, c), back.origin);
  });
});
