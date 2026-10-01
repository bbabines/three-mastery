import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { railDelta } from './drill';

describe('railDelta', () => {
it('projects onto a tilted non-unit rail without changing inputs', () => {
    const start = new THREE.Vector3(1,2,3), end = new THREE.Vector3(4,1,5), axis = new THREE.Vector3(2,1,0);
    const before = [start.clone(),end.clone(),axis.clone()];
    expectVector(railDelta(start,end,axis),end.clone().sub(start).projectOnVector(axis));
    expectUnchanged(start,before[0],'start'); expectUnchanged(end,before[1],'end'); expectUnchanged(axis,before[2],'axis');
  });
});
