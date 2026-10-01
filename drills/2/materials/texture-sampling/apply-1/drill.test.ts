import { answered } from '@harness/check';
import { LinearMipmapLinearFilter, MeshStandardMaterial, NoColorSpace, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { packedTiledSurface } from './drill';
describe('packedTiledSurface', () => {
 it('shares one data texture across packed surface channels', () => {
  for (const level of [2,8]) {
   const material = new MeshStandardMaterial(), orm = new Texture();
   expect(answered(packedTiledSurface(material,orm,level))).toBe(material);
   expect(material.roughnessMap).toBe(orm); expect(material.metalnessMap).toBe(orm);
   expect(orm.colorSpace).toBe(NoColorSpace); expect(orm.generateMipmaps).toBe(true);
   expect(orm.minFilter).toBe(LinearMipmapLinearFilter); expect(orm.anisotropy).toBe(level);
  }
 });
});
