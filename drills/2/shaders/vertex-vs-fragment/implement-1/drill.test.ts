import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { uvGradient } from './drill';
describe('uvGradient', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(uvGradient());
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.vertexShader).toMatch(/vUv\s*=\s*uv/);
  expect(material.fragmentShader).toMatch(/gl_FragColor\s*=\s*vec4\(vUv\.x,\s*vUv\.y/);
 });
});
