import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { uniqueGeometryCount, rendersForCamera } from './drill';

describe('uniqueGeometryCount', () => {
it('counts a shared geometry once, including hidden uses', () => {
    const root = new THREE.Group(); const shared = new THREE.BoxGeometry(); const a = new THREE.Mesh(shared); const b = new THREE.Mesh(shared); b.visible = false;
    root.add(a, b, new THREE.Mesh(new THREE.SphereGeometry()));
    expectNumber(uniqueGeometryCount(root), 2);
  });
});

describe('rendersForCamera', () => {
it('checks camera layers on the object and visibility through parents', () => {
    const camera = new THREE.PerspectiveCamera(); camera.layers.set(2);
    const root = new THREE.Group(); const mesh = new THREE.Mesh(); root.add(mesh); mesh.layers.set(2);
    expectExact(rendersForCamera(mesh, camera), true);
    root.visible = false; expectExact(rendersForCamera(mesh, camera), false);
    root.visible = true; mesh.layers.set(1); expectExact(rendersForCamera(mesh, camera), false);
  });
});
