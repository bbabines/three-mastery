import { answered } from '@harness/check';
import { Color, MeshStandardMaterial, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { brushedSteel } from './drill';
describe('brushedSteel', () => {
 it('uses roughness instead of half metalness for a brushed finish', () => {
  for (const color of ['#8899aa', '#c19742']) {
   const material = new MeshStandardMaterial({ metalness: .4, roughness: .04 });
   expect(answered(brushedSteel(material,color))).toBe(material);
   expect(material.metalness).toBe(1);
   expect(material.roughness).toBeGreaterThan(.35);
   expect(material.roughness).toBeLessThan(.75);
   expect(material.color.equals(new Color(color))).toBe(true);
  }
 });
 it('preserves an existing normal map', () => {
  const map = new Texture(), material = new MeshStandardMaterial({ normalMap: map });
  answered(brushedSteel(material,'#999999')); expect(material.normalMap).toBe(map);
 });
});
