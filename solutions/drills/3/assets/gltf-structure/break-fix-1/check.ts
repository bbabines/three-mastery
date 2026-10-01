import { expect } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';

type Collect = (part: Group) => Mesh[];

export function checkPrimitives(collect: Collect): void {
  const part = new Group();
  const nested = new Group();
  const a = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
  const b = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
  part.add(a, nested); nested.add(b);
  expect(collect(part), 'a multi-primitive part includes nested meshes').toEqual([a, b]);
}
