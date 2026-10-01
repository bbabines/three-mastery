import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { lightWorld } from './drill';

describe('transforms.local-vs-world', () => {
  it('place a work light a fixed offset from a nested part, returning the light spot in world space without changing the offset', () => {
    const parent = new THREE.Group(); const part = new THREE.Object3D(); parent.position.set(3, 2, -1); parent.rotation.y = 0.6; part.position.set(1, 0, 2); parent.add(part);
    const offset = new THREE.Vector3(0, 0.5, 1); const before = offset.clone();
    const actual = answered(lightWorld(part, offset));
    expect(actual.distanceTo(part.localToWorld(before.clone()))).toBeLessThan(1e-6);
    expect(offset.equals(before)).toBe(true);
  });
});
