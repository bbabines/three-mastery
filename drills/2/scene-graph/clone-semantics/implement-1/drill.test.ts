import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { coloredClone } from './drill';

describe('coloredClone', () => {
it('shares geometry, isolates material, and preserves the original color', () => {
    const geometry = new THREE.BoxGeometry(); const material = new THREE.MeshStandardMaterial({ color: 'blue' });
    const source = new THREE.Mesh(geometry, material); const copy = answered(coloredClone(source, 'red'));
    expect(copy).not.toBe(source); expect(copy.geometry).toBe(geometry); expect(copy.material).not.toBe(material);
    expect((copy.material as THREE.MeshStandardMaterial).color.getHex()).toBe(new THREE.Color('red').getHex());
    expect(material.color.getHex()).toBe(new THREE.Color('blue').getHex());
  });
});
