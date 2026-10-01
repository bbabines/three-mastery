import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { nodeNamesForMesh } from './drill';

describe('nodeNamesForMesh', () => {
it('finds two nodes that reuse one mesh and ignores unrelated nodes', () => {
    const document = { nodes: [{ name: 'left', mesh: 2 }, { name: 'empty' }, { name: 'right', mesh: 2 }, { name: 'base', mesh: 0 }] };
    expect(answered(nodeNamesForMesh(document,2))).toEqual(['left','right']);
    expect(answered(nodeNamesForMesh(document,3))).toEqual([]);
  });
});
