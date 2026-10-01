import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { radialFalloff } from './drill';
describe('radialFalloff', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(radialFalloff());
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.fragmentShader).toMatch(/clamp\(length\(vUv/);
  expect(material.fragmentShader).toMatch(/mix\(vec3/);
 });
});
