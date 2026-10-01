import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { needsDraco, loadState } from './drill';

describe('needsDraco', () => {
it('recognizes Draco only from the glTF extension', () => {
    expectExact(needsDraco(['KHR_draco_mesh_compression','KHR_materials_clearcoat']), true);
    expectExact(needsDraco(['EXT_meshopt_compression']), false);
  });
});

describe('loadState', () => {
it('keeps failure distinct from loading and completion', () => {
    expectExact(loadState(false,false), 'loading'); expectExact(loadState(true,false), 'ready');
    expectExact(loadState(false,true), 'failed'); expectExact(loadState(true,true), 'failed');
  });
});
