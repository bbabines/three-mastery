import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { selectableId, swapMaterial } from './drill';

describe('selectableId', () => {
it('finds metadata on a parent and returns empty for untagged hits', () => {
    const part = new THREE.Group(); part.userData.selectableId = 'left-cup';
    const child = new THREE.Mesh(); part.add(new THREE.Group().add(child));
    expectExact(selectableId(child), 'left-cup');
    expectExact(selectableId(new THREE.Mesh()), '');
  });
});

describe('swapMaterial', () => {
it('returns the exact original material for later restoration', () => {
    const original = new THREE.MeshBasicMaterial({ color: 'blue' }); const replacement = new THREE.MeshBasicMaterial({ color: 'yellow' });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), original);
    const saved = answered(swapMaterial(mesh, replacement));
    expect(saved).toBe(original); expect(mesh.material).toBe(replacement);
    mesh.material = saved as THREE.MeshBasicMaterial; expect(mesh.material).toBe(original);
  });
});
