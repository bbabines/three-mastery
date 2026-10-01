import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { canAppear } from './drill';

describe('canAppear', () => {
  it('spots a zero-scale parent despite a loaded and visible mesh', () => {
    const parent = new Group();
    const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
    parent.add(mesh);
    expect(canAppear(mesh)).toBe(true);
    parent.scale.set(0, 1, 1);
    expect(canAppear(mesh)).toBe(false);
    parent.scale.set(2, 1, 1);
    expect(canAppear(mesh)).toBe(true);
  });
});
