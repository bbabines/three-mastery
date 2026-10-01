import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { viewRim } from './drill';
describe('viewRim', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(viewRim());
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.vertexShader).toMatch(/normalMatrix\s*\*\s*normal/);
  expect(material.fragmentShader).toMatch(/vViewNormal/);
  expect(material.fragmentShader).toMatch(/rim/);
 });
});
