import { answered } from '@harness/check';
import { MeshStandardMaterial, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { localChromeReflection } from './drill';
describe('localChromeReflection', () => {
 it('connects reflection and strength to the same chrome material', () => {
  for (const intensity of [.6, 1.8]) {
   const material = new MeshStandardMaterial(), reflection = new Texture();
   expect(answered(localChromeReflection(material, reflection, intensity))).toBe(material);
   expect(material.envMap).toBe(reflection);
   expect(material.envMapIntensity).toBe(intensity);
   expect(material.metalness).toBe(1);
   expect(material.roughness).toBeLessThan(.2);
  }
 });
});
