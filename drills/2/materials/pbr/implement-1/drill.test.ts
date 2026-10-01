import { answered } from '@harness/check';
import { MeshStandardMaterial, Color, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { chromeFinish } from './drill';
describe('chromeFinish', () => {
 it('makes a metal endpoint with narrow reflections', () => {
  const material = new MeshStandardMaterial({ metalness: .5, roughness: .9, color: 'red' });
  expect(answered(chromeFinish(material))).toBe(material);
  expect(material.metalness).toBe(1);
  expect(material.roughness).toBeLessThan(.15);
  expect(material.color.equals(new Color('#eeeeee'))).toBe(true);
 });
 it('leaves the environment map in place', () => {
  const env = new Texture(), material = new MeshStandardMaterial({ envMap: env });
  answered(chromeFinish(material)); expect(material.envMap).toBe(env);
 });
});
