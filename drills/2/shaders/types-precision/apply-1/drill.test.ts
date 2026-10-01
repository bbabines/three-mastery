import { answered } from '@harness/check';
import { ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { farOriginGradient } from './drill';
describe('farOriginGradient', () => {
 it('wires the intended GLSL values', () => {
  const material=answered(farOriginGradient(100000.0)); expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.uniforms.uOrigin.value).toBe(100000);
  expect(material.vertexShader).toMatch(/precision\s+highp\s+float/);
  expect(material.fragmentShader).toMatch(/precision\s+highp\s+float/);
  expect(material.fragmentShader).toMatch(/0\.001/);
 });
});
