import { MeshStandardMaterial, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { retireMaterial } from './drill';
describe('retireMaterial', () => {
  it('releases only old-owned textures and the old material', () => {
    const shared = new Texture(); const unique = new Texture();
    const oldMaterial = new MeshStandardMaterial({ map: shared, roughnessMap: unique });
    const nextMaterial = new MeshStandardMaterial({ map: shared });
    const disposed: string[] = [];
    shared.addEventListener('dispose', () => disposed.push('shared'));
    unique.addEventListener('dispose', () => disposed.push('unique'));
    oldMaterial.addEventListener('dispose', () => disposed.push('old'));
    retireMaterial(oldMaterial, nextMaterial);
    expect(disposed.sort()).toEqual(['old', 'unique']);
  });
});
