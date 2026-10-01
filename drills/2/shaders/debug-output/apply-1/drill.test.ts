import { answered } from '@harness/check';
import { ShaderMaterial, Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { depthDebug } from './drill';
describe('depthDebug', () => {
 it('wires the intended shader values and stages', () => {
  const material = answered(depthDebug());
  expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.fragmentShader).toMatch(/gl_FragCoord\.z/);
  expect(material.fragmentShader).toMatch(/gl_FragColor/);
 });
});
