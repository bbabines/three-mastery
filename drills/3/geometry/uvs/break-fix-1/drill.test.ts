import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { tileFirstFace } from './drill';

function uvAtCorner(geometry: THREE.BufferGeometry, corner: number): THREE.Vector2 {
  const vertex = geometry.index?.getX(corner) ?? corner;
  const uv = geometry.getAttribute('uv');
  return new THREE.Vector2(uv.getX(vertex), uv.getY(vertex));
}

describe('geometry.uvs and geometry.groups', () => {
  it('shifts only the first triangle, even when indexed faces share vertices', () => {
    const geometry = new THREE.PlaneGeometry(2, 2, 2, 2);
    const before = geometry.clone();
    const offset = new THREE.Vector2(0.25, -0.5);
    const result = tileFirstFace(geometry, offset);
    const corners = geometry.index!.count;

    expect(result).not.toBe(geometry);
    expect(result.index?.count ?? result.getAttribute('position').count).toBe(corners);
    for (let corner = 0; corner < corners; corner++) {
      const expectedUv = uvAtCorner(before, corner);
      if (corner < 3) expectedUv.add(offset);
      expect(uvAtCorner(result, corner).distanceTo(expectedUv)).toBeLessThan(1e-6);
      expect(uvAtCorner(geometry, corner).equals(uvAtCorner(before, corner))).toBe(true);
    }
    expect(offset).toEqual(new THREE.Vector2(0.25, -0.5));
  });

  it('draws the first triangle with slot one and every other triangle with slot zero', () => {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const result = tileFirstFace(geometry, new THREE.Vector2(1, 0));
    const corners = result.index?.count ?? result.getAttribute('position').count;
    expect(result.groups).toEqual([
      { start: 0, count: 3, materialIndex: 1 },
      { start: 3, count: corners - 3, materialIndex: 0 },
    ]);
    expect(geometry.groups).toEqual([]);
  });
});
