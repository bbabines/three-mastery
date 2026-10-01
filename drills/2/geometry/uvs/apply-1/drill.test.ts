import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { assignFaceUv } from './drill';

describe('geometry.uvs', () => {
  it('copy a triangle mesh and shift its first uv island for a different material tile, preserving the original uvs', () => {
    const g=new THREE.PlaneGeometry();
    const sourceUv = g.getAttribute('uv');
    const original = Array.from({ length: g.index!.count }, (_, i) =>
      new THREE.Vector2(sourceUv.getX(g.index!.getX(i)), sourceUv.getY(g.index!.getX(i))));
    const offset = new THREE.Vector2(1, 0.5);
    const shifted=answered(assignFaceUv(g,offset));
    const outputUv = shifted.getAttribute('uv');
    expect(shifted.index).toBeNull();
    for (let i = 0; i < original.length; i++) {
      const expected = original[i].clone().add(i < 3 ? offset : new THREE.Vector2());
      expect(new THREE.Vector2(outputUv.getX(i), outputUv.getY(i)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(g.index!.count).toBe(6);
    expect(sourceUv.getX(0)).toBe(original[0].x);
    expect(offset.equals(new THREE.Vector2(1, 0.5))).toBe(true);
    expect(shifted.groups[0]).toEqual({ start: 0, count: 3, materialIndex: 1 });
    expect(shifted.groups[1]).toEqual({ start: 3, count: 3, materialIndex: 0 });
  });
});
