import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { namedMeshes, removeTaggedHelpers } from './drill';

describe('namedMeshes', () => {
it('finds duplicate mesh names and ignores a Group with that name', () => {
    const root = new THREE.Group(); const a = new THREE.Mesh(); const b = new THREE.Mesh(); const group = new THREE.Group();
    a.name = b.name = group.name = 'bolt'; b.visible = false; root.add(a, b, group);
    expect(answered(namedMeshes(root, 'bolt'))).toEqual([a, b]);
  });
});

describe('removeTaggedHelpers', () => {
it('removes adjacent helpers without skipping the next sibling', () => {
    const root = new THREE.Group(); const helpers = Array.from({ length: 4 }, () => new THREE.Group());
    for (const helper of helpers) { helper.userData.helper = true; root.add(helper); }
    const keep = new THREE.Mesh(); root.add(keep);
    expectNumber(removeTaggedHelpers(root), 4);
    expect(root.children).toEqual([keep]);
  });
});
