import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { snapToEdge } from './drill';

describe('snapToEdge', () => {
it('clamps beyond both ends and finds an interior closest point', () => {
    const edge = new THREE.Line3(new THREE.Vector3(1, 0, 1), new THREE.Vector3(3, 2, 1));
    const points = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(8, 4, 0), new THREE.Vector3(2, 0, 3)];
    for (const point of points) expectVector(snapToEdge(point, edge), edge.closestPointToPoint(point, true, new THREE.Vector3()));
    expect(edge.start.toArray()).toEqual([1,0,1]);
  });
});
