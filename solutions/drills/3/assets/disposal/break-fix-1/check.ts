import { expect } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Texture } from 'three';

type Retire = (root: Group) => void;

export function checkRetirement(retire: Retire): void {
  const geometry = new BoxGeometry();
  const texture = new Texture();
  const material = new MeshStandardMaterial({ map: texture });
  const root = new Group();
  root.add(new Mesh(geometry, material));
  const freed: string[] = [];
  geometry.addEventListener('dispose', () => freed.push('geometry'));
  material.addEventListener('dispose', () => freed.push('material'));
  texture.addEventListener('dispose', () => freed.push('texture'));
  retire(root);
  expect(freed.sort(), 'removing the node does not release GPU resources').toEqual(['geometry', 'material', 'texture']);
}
