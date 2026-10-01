import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { primitiveMeshes } from './drill';

describe('primitiveMeshes', () => {
  it('finds all primitive meshes through nested groups', () => {
    const part = new Group();
    const first = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 'red' }));
    const branch = new Group();
    const second = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 'blue' }));
    branch.add(second); part.add(first, branch);
    expect(primitiveMeshes(part)).toEqual([first, second]);
    expect(part.children).toEqual([first, branch]);
  });
  it('includes the root when the imported part itself is a Mesh', () => {
    const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
    expect(primitiveMeshes(mesh)).toEqual([mesh]);
  });
});
