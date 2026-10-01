import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { softRing } from './drill';
describe('softRing', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(softRing(.3,.03));
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.uniforms.uRadius.value).toBe(.3); expect(material.uniforms.uEdge.value).toBe(.03);
  expect(material.fragmentShader.match(/smoothstep\(/g)?.length).toBe(2);
  expect(material.fragmentShader).toMatch(/length\(vUv/);
 });
});
