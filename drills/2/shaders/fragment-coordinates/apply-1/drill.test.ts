import { answered } from '@harness/check';
import { ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { cssChecker } from './drill';
describe('cssChecker', () => {
 it('wires the intended GLSL values', () => {
  const material=answered(cssChecker(2)); expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.uniforms.uDpr.value).toBe(2);
  expect(material.fragmentShader).toMatch(/gl_FragCoord\.xy\s*\/\s*uDpr/);
  expect(material.fragmentShader).toMatch(/floor\(css\.x\/8\.0\)/);
 });
});
