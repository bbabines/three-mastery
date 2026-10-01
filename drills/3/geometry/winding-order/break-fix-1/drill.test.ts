import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { flipFrontFace } from './drill';

function corner(geometry: THREE.BufferGeometry, name: string, offset: number): number[] {
  const attribute = geometry.getAttribute(name);
  const vertex = geometry.index?.getX(offset) ?? offset;
  return Array.from({ length: attribute.itemSize }, (_, component) => attribute.getComponent(vertex, component));
}

describe('geometry.winding-order', () => {
  for (const indexed of [true, false]) {
    it(`reverses ${indexed ? 'indexed' : 'non-indexed'} faces without detaching UVs from corners`, () => {
      const source = new THREE.PlaneGeometry(2, 2);
      const geometry = indexed ? source : source.toNonIndexed();
      const before = geometry.clone();
      const result = flipFrontFace(geometry);
      const corners = before.index?.count ?? before.getAttribute('position').count;

      expect(result).not.toBe(geometry);
      expect(result.index?.count ?? result.getAttribute('position').count).toBe(corners);
      for (let face = 0; face < corners; face += 3) {
        for (const [slot, originalSlot] of [0, 2, 1].entries()) {
          for (const name of ['position', 'uv']) {
            expect(corner(result, name, face + slot)).toEqual(corner(before, name, face + originalSlot));
          }
        }
      }
      for (let vertex = 0; vertex < result.getAttribute('normal').count; vertex++) {
        const normal = new THREE.Vector3().fromBufferAttribute(result.getAttribute('normal'), vertex);
        const original = new THREE.Vector3().fromBufferAttribute(before.getAttribute('normal'), vertex);
        expect(normal.equals(original.negate())).toBe(true);
      }
      expect(Array.from(geometry.index?.array ?? [])).toEqual(Array.from(before.index?.array ?? []));
      expect(Array.from(geometry.getAttribute('position').array)).toEqual(Array.from(before.getAttribute('position').array));
      expect(Array.from(geometry.getAttribute('uv').array)).toEqual(Array.from(before.getAttribute('uv').array));
    });
  }

  it('moves the visible side from the front to the back', () => {
    const geometry = flipFrontFace(new THREE.PlaneGeometry(2, 2));
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.FrontSide }));
    const front = new THREE.Raycaster(new THREE.Vector3(0.3, 0.2, 3), new THREE.Vector3(0, 0, -1));
    const back = new THREE.Raycaster(new THREE.Vector3(0.3, 0.2, -3), new THREE.Vector3(0, 0, 1));
    expect(front.intersectObject(mesh)).toHaveLength(0);
    expect(back.intersectObject(mesh)).toHaveLength(1);
  });
});
