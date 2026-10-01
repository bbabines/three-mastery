import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { retireProduct } from './drill';

describe('retireProduct', () => {
  it('removes the subtree and disposes each owned resource once', () => {
    const geometry = new BoxGeometry();
    const map = new Texture();
    const normalMap = new Texture();
    const material = new MeshStandardMaterial({ map, normalMap });
    const scene = new Group();
    const root = new Group();
    root.add(new Mesh(geometry, material), new Mesh(geometry, material));
    scene.add(root);
    const events: string[] = [];
    geometry.addEventListener('dispose', () => events.push('geometry'));
    material.addEventListener('dispose', () => events.push('material'));
    map.addEventListener('dispose', () => events.push('color map'));
    normalMap.addEventListener('dispose', () => events.push('normal map'));
    retireProduct(root);
    expect(root.parent).toBeNull();
    expect(events.sort()).toEqual(['color map', 'geometry', 'material', 'normal map']);
  });
});
