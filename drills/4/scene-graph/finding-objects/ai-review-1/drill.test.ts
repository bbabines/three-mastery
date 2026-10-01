import { Object3D } from 'three';
import { describe, expect, it } from 'vitest';
import { namedParts } from './drill';
describe('namedParts', () => {
  it('finds all matches across branches in traversal order', () => {
    const root = new Object3D(); const left = new Object3D(); const right = new Object3D();
    const a = new Object3D(); a.name = 'fastener'; const b = new Object3D(); b.name = 'fastener';
    left.add(a); right.add(b); root.add(left, right);
    expect(namedParts(root, 'fastener')).toEqual([a, b]);
    expect(namedParts(root, 'missing')).toEqual([]);
    expect(root.children).toEqual([left, right]);
  });
});
