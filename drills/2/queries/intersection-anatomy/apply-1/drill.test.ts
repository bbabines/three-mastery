import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { instanceIndex } from './drill';

describe('instanceIndex', () => {
it('distinguishes an instance from an ordinary mesh', () => {
    const object = new THREE.Mesh(); const point = new THREE.Vector3(1, 2, 3);
    const hit = { object, point, distance: 3, instanceId: 7 } as THREE.Intersection;
    expectNumber(instanceIndex(hit), 7);
    expectNumber(instanceIndex({ object, point, distance: 3 } as THREE.Intersection), -1);
    expectVector(hit.point, point);
  });
});
