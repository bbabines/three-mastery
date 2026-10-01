import { answered } from '@harness/check';
import { ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { circleMask } from './drill';
describe('circleMask', () => {
 it('wires the intended GLSL values', () => {
  const material=answered(circleMask()); expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.fragmentShader).toMatch(/if\s*\(\s*length\(vUv/);
  expect(material.fragmentShader).toMatch(/discard/);
 });
});
