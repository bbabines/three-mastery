import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { fadeMaterial } from './drill';

describe('fadeMaterial', () => {
  it('clamps alpha and recompiles when transparency changes after a draw', () => {
    const material = new THREE.MeshBasicMaterial();
    const initialVersion=material.version;
    fadeMaterial(material,0.4); expect([material.opacity,material.transparent,material.depthWrite]).toEqual([0.4,true,false]);
    expect(material.version).toBeGreaterThan(initialVersion);
    const fadeVersion=material.version;
    fadeMaterial(material,1.5); expect([material.opacity,material.transparent,material.depthWrite]).toEqual([1,false,true]);
    expect(material.version).toBeGreaterThan(fadeVersion);
  });
});
