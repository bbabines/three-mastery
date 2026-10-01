import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { worldOrigin } from './drill';

describe('transforms.matrix-vs-matrixworld', () => {
  it('find where the origin of a part inside a moving rack ends up in the world by reading its current world matrix', () => {
    const rack = new THREE.Group(); const part = new THREE.Object3D(); rack.add(part);
    rack.position.set(-2, 1, 4); rack.rotation.y = 0.4; part.position.set(2, 0, 1);
    expect(answered(worldOrigin(part)).distanceTo(part.getWorldPosition(new THREE.Vector3()))).toBeLessThan(1e-6);
    rack.position.x = 5;
    expect(answered(worldOrigin(part)).distanceTo(part.getWorldPosition(new THREE.Vector3()))).toBeLessThan(1e-6);
  });
});
