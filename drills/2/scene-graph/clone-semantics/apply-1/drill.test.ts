import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cloneForVariant } from './drill';

describe('cloneForVariant', () => {
it('isolates every material but shares every geometry', () => {
    const root = new THREE.Group(); const geometry = new THREE.BoxGeometry(); const material = new THREE.MeshStandardMaterial({ color: 'blue' });
    root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, [material, material]));
    const copy = answered(cloneForVariant(root));
    const sourceMeshes: THREE.Mesh[] = []; const copyMeshes: THREE.Mesh[] = [];
    root.traverse((child) => { if (child instanceof THREE.Mesh) sourceMeshes.push(child); });
    copy.traverse((child) => { if (child instanceof THREE.Mesh) copyMeshes.push(child); });
    expect(copyMeshes).toHaveLength(2);
    for (let i = 0; i < 2; i++) expect(copyMeshes[i].geometry).toBe(sourceMeshes[i].geometry);
    expect(copyMeshes[0].material).not.toBe(sourceMeshes[0].material);
    expect(Array.isArray(copyMeshes[1].material)).toBe(true);
    expect((copyMeshes[1].material as THREE.Material[])[0]).not.toBe(material);
  });
});
