import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { pulseUv } from './drill';
describe('pulseUv', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(pulseUv(1.25));
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.uniforms.uTime.value).toBe(1.25);
  expect(material.vertexShader).toMatch(/vUv\s*=\s*uv/);
  expect(material.fragmentShader).toMatch(/uniform\s+float\s+uTime/);
  expect(material.fragmentShader).toMatch(/vUv\.x.*sin\(uTime\)/);
 });
});
