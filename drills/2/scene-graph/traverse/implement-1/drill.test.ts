import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleMeshes } from './drill';

describe('visibleMeshes', () => {
it('skips every child of a hidden branch but keeps nested visible meshes', () => {
    const root = new THREE.Group();
    const shown = new THREE.Mesh(); shown.name = 'shown';
    const hidden = new THREE.Group(); hidden.visible = false;
    const hiddenMesh = new THREE.Mesh(); hiddenMesh.name = 'hidden'; hidden.add(hiddenMesh);
    const nested = new THREE.Group(); const nestedMesh = new THREE.Mesh(); nestedMesh.name = 'nested'; nested.add(nestedMesh);
    root.add(shown, hidden, nested);
    expect(answered(visibleMeshes(root)).map((mesh) => mesh.name)).toEqual(['shown', 'nested']);
    expect(root.children).toEqual([shown, hidden, nested]);
  });
});
