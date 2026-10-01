import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { retireVariant } from './drill';

describe('retireVariant', () => {
it('keeps shared geometry and disposes a unique retired material', () => {
    const root = new THREE.Group(); const geometry = new THREE.BoxGeometry();
    const active = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial());
    const retiredMaterial = new THREE.MeshBasicMaterial(); const retired = new THREE.Mesh(geometry,retiredMaterial);
    root.add(active,retired); let geometryDisposals = 0, materialDisposals = 0;
    geometry.addEventListener('dispose',()=>geometryDisposals++); retiredMaterial.addEventListener('dispose',()=>materialDisposals++);
    expectNumber(retireVariant(root,retired),1); expect(root.children).toEqual([active]);
    expect(geometryDisposals).toBe(0); expect(materialDisposals).toBe(1);
  });
});
