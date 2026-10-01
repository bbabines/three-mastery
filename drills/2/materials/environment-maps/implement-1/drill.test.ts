import { answered } from '@harness/check';
import { Scene, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { setStudioEnvironment } from './drill';
describe('setStudioEnvironment', () => {
 it('separates reflected light from the visible backdrop', () => {
  const scene = new Scene(), lighting = new Texture(), backdrop = new Texture();
  expect(answered(setStudioEnvironment(scene, lighting, backdrop))).toBe(scene);
  expect(scene.environment).toBe(lighting);
  expect(scene.background).toBe(backdrop);
  expect(scene.background).not.toBe(scene.environment);
 });
});
