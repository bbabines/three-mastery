import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { primitiveCount } from './drill';

describe('primitiveCount', () => {
it('counts pieces instead of assuming one Mesh per glTF mesh', () => {
    const document = { meshes: [{ primitives: [{}, {}, {}] }, { primitives: [{}] }] };
    expectNumber(primitiveCount(document, 0), 3); expectNumber(primitiveCount(document, 1), 1);
    expectNumber(primitiveCount(document, 7), 0);
  });
});
