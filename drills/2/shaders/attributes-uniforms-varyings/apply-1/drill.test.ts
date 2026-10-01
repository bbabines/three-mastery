import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { barycentricWire } from './drill';
describe('barycentricWire', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(barycentricWire());
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.vertexShader).toMatch(/attribute\s+vec3\s+barycentric/);
  expect(material.vertexShader).toMatch(/vBary\s*=\s*barycentric/);
  expect(material.fragmentShader).toMatch(/min\(vBary\.x/);
 });
});
