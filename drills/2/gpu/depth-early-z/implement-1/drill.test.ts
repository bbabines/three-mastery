import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { opaqueOccluder } from './drill';

describe('opaqueOccluder', () => {
it('restores depth testing and writes after a transparent variant', () => {
    const material = new THREE.MeshBasicMaterial({transparent:true,depthTest:false,depthWrite:false});
    const result = answered(opaqueOccluder(material)); expect(result).toBe(material);
    expect([material.transparent,material.depthTest,material.depthWrite]).toEqual([false,true,true]);
  });
});
