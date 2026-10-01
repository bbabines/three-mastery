import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { disposeMeshOwned } from './drill';

describe('disposeMeshOwned', () => {
it('disposes owned material and texture but preserves shared geometry', () => {
    const geometry = new THREE.BoxGeometry(); const texture = new THREE.Texture(); const material = new THREE.MeshStandardMaterial({map:texture});
    const mesh = new THREE.Mesh(geometry,material); const disposed: string[] = [];
    geometry.addEventListener('dispose',()=>disposed.push('geometry'));
    material.addEventListener('dispose',()=>disposed.push('material'));
    texture.addEventListener('dispose',()=>disposed.push('texture'));
    expectNumber(disposeMeshOwned(mesh,new Set([geometry])),2);
    expect(disposed.sort()).toEqual(['material','texture']);
  });
});
