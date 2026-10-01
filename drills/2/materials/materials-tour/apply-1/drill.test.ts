import { answered } from '@harness/check';
import { Color, FrontSide, MeshBasicMaterial, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { unlitCutout } from './drill';
describe('unlitCutout', () => {
 it('makes a color-accurate unlit front-sided cutout', () => {
  for (const color of ['#336699','#d87335']) {
   const mask = new Texture();
   const material = answered(unlitCutout(color, mask));
   expect(material).toBeInstanceOf(MeshBasicMaterial);
   expect(material.color.equals(new Color(color))).toBe(true);
   expect(material.side).toBe(FrontSide);
   expect(material.alphaMap).toBe(mask);
   expect(material.alphaTest).toBeGreaterThan(0);
   expect(material.transparent).toBe(false);
   expect(material.toneMapped).toBe(false);
  }
 });
});
