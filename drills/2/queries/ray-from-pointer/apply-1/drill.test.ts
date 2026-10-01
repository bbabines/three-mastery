import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pickName } from './drill';

describe('pickName', () => {
it('hits a nested mesh nearest the camera', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100); camera.position.set(0, 0, 5); camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
    const root = new THREE.Group(); const far = new THREE.Mesh(new THREE.BoxGeometry()); far.name = 'far'; far.position.z = -2;
    const near = new THREE.Mesh(new THREE.BoxGeometry()); near.name = 'near'; root.add(new THREE.Group().add(near), far); root.updateMatrixWorld(true);
    expectExact(pickName(new THREE.Vector2(0, 0), camera, root), 'near');
    expectExact(pickName(new THREE.Vector2(0.95, 0.95), camera, root), '');
  });
});
