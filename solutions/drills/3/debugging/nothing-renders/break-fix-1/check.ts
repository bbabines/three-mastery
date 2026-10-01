import { expect } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';

type Inspect = (mesh: Mesh) => boolean;

export function checkDegenerate(canAppear: Inspect): void {
  const parent = new Group();
  const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
  parent.add(mesh);
  parent.scale.set(0, 2, 1);
  expect(canAppear(mesh), 'a zero-scale parent collapses the mesh').toBe(false);
}
