import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { fadeMaterial } from './drill';

describe('fadeMaterial', () => {
it('clamps alpha and restores opaque depth writes at the end', () => {
    const material = new THREE.MeshBasicMaterial();
    fadeMaterial(material,0.4); expect([material.opacity,material.transparent,material.depthWrite]).toEqual([0.4,true,false]);
    fadeMaterial(material,1.5); expect([material.opacity,material.transparent,material.depthWrite]).toEqual([1,false,true]);
  });
});
