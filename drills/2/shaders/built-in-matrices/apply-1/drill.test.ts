import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { screenGradient } from './drill';
describe('screenGradient', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(screenGradient(new Vector2(16,16)));
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.uniforms.uResolution.value.equals(new Vector2(16,16))).toBe(true);
  expect(material.vertexShader).toMatch(/projectionMatrix\s*\*\s*modelViewMatrix/);
  expect(material.fragmentShader).toMatch(/gl_FragCoord\.x\s*\/\s*uResolution\.x/);
 });
});
