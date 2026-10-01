import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { colorFaultArea } from './drill';

describe('colorFaultArea', () => {
it('checks texture input before renderer output', () => {
    const texture = new THREE.Texture(); const material = new THREE.MeshStandardMaterial({map:texture});
    expectExact(colorFaultArea(material,THREE.SRGBColorSpace),'material');
    texture.colorSpace=THREE.SRGBColorSpace;
    expectExact(colorFaultArea(material,THREE.LinearSRGBColorSpace),'pipeline');
    expectExact(colorFaultArea(material,THREE.SRGBColorSpace),'ready');
    material.dispose(); texture.dispose();
  });
});
