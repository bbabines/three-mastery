import { answered } from '@harness/check';
import { ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { aaWireGrid } from './drill';
describe('aaWireGrid', () => {
 it('wires the intended GLSL values', () => {
  const material=answered(aaWireGrid()); expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.fragmentShader).toMatch(/fwidth\(/);
  expect(material.fragmentShader).toMatch(/smoothstep\(/);
  expect(material.fragmentShader).toMatch(/fract\(vUv/);
 });
});
