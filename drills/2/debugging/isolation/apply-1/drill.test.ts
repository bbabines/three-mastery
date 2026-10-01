import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleSlice } from './drill';

describe('visibleSlice', () => {
it('bisects without removing children', () => {
    const root=new THREE.Group(); for (const name of ['a','b','c','d','e']) { const child=new THREE.Group(); child.name=name; root.add(child); }
    expect(answered(visibleSlice(root,0,2))).toEqual(['a','b']);
    expect(answered(visibleSlice(root,2,5))).toEqual(['c','d','e']);
    expect(root.children).toHaveLength(5); expect(root.children.map(c=>c.visible)).toEqual([false,false,true,true,true]);
  });
});
