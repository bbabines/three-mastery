import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { smoothedTarget } from './drill';

describe('smoothedTarget', () => {
it('matches one long step with two half steps and preserves inputs', () => {
    const from = new THREE.Vector3(1,2,3), to = new THREE.Vector3(8,0,-4);
    const one = answered(smoothedTarget(from,to,5,1/30));
    const half = answered(smoothedTarget(from,to,5,1/60));
    const twice = answered(smoothedTarget(half,to,5,1/60));
    expectVector(twice,one); expectUnchanged(from,new THREE.Vector3(1,2,3),'current'); expectUnchanged(to,new THREE.Vector3(8,0,-4),'target');
  });
});
