import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { assignFaceUv } from './drill';

describe('geometry.uvs', () => {
  it('copy a triangle mesh and shift its first uv island for a different material tile, preserving the original uvs', () => {
    const g=new THREE.PlaneGeometry(); const before=g.getAttribute('uv').getX(0);
    const shifted=answered(assignFaceUv(g,new THREE.Vector2(1,0.5)));
    expect(shifted.getAttribute('uv').getX(0)).toBeCloseTo(before+1);
    expect(g.getAttribute('uv').getX(0)).toBe(before);
    expect(shifted.groups[0]).toEqual({ start: 0, count: 3, materialIndex: 1 });
  });
});
