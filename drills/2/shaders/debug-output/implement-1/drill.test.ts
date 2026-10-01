import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { uvDebug } from './drill';
describe('uvDebug', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(uvDebug());
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.vertexShader).toMatch(/vUv\s*=\s*uv/);
  expect(material.fragmentShader).toMatch(/fract\(vUv\.x/);
  expect(material.fragmentShader).toMatch(/fract\(vUv\.y/);
 });
});
