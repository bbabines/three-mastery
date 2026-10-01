import { answered } from '@harness/check';
import { ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { zUpToYUp } from './drill';
describe('zUpToYUp', () => {
 it('wires the intended GLSL values', () => {
  const material=answered(zUpToYUp()); expect(material).toBeInstanceOf(ShaderMaterial);
  expect(material.vertexShader).toMatch(/position\.x\s*,\s*position\.z\s*,\s*-position\.y/);
 });
});
