import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { showOnlyBranch } from './drill';

describe('showOnlyBranch', () => {
it('hides siblings without deleting or mutating the chosen subtree', () => {
    const root = new THREE.Group(); const a=new THREE.Group(), b=new THREE.Group(), c=new THREE.Group(); const nested=new THREE.Mesh(); b.add(nested); root.add(a,b,c);
    expectNumber(showOnlyBranch(root,b),2); expect(root.children).toEqual([a,b,c]);
    expect([a.visible,b.visible,c.visible,nested.visible]).toEqual([false,true,false,true]);
  });
});
