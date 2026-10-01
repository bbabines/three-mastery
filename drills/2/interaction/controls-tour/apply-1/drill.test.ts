import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { needsControlsUpdate, dollyChanges } from './drill';

describe('needsControlsUpdate', () => {
it('keeps updating for damping after input stops', () => {
    expectExact(needsControlsUpdate(true,false),true); expectExact(needsControlsUpdate(false,true),true);
    expectExact(needsControlsUpdate(false,false),false);
  });
});

describe('dollyChanges', () => {
it('uses zoom only for an orthographic camera', () => {
    expectExact(dollyChanges(new THREE.OrthographicCamera()),'zoom');
    expectExact(dollyChanges(new THREE.PerspectiveCamera()),'distance');
  });
});
