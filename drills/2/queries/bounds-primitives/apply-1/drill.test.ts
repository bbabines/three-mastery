import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { positiveSide, worldAabbSize } from './drill';

describe('positiveSide', () => {
it('uses the sign of plane distance on both sides', () => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2);
    expectExact(positiveSide(plane, new THREE.Vector3(0, 3, 0)), true);
    expectExact(positiveSide(plane, new THREE.Vector3(0, 1, 0)), false);
  });
});

describe('worldAabbSize', () => {
it('expands the AABB around a turned box', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1)); mesh.rotation.y = Math.PI / 4; mesh.position.set(2, 0, -1);
    mesh.updateMatrixWorld(true);
    const expected = new THREE.Box3().setFromObject(mesh, true).getSize(new THREE.Vector3());
    expectVector(worldAabbSize(mesh), expected);
    expect(answered(worldAabbSize(mesh)).x).toBeGreaterThan(2);
  });
});
