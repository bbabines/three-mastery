import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { tileFirstFace } from './drill';

describe('geometry.uvs', () => {
  it('repairs the reported symptom for a general case', () => {
    const g=new THREE.PlaneGeometry(), before=g.getAttribute('uv').getX(0); const copy=tileFirstFace(g,new THREE.Vector2(1,0.5));
    expect(copy.getAttribute('uv').getX(0)).toBeCloseTo(before+1); expect(copy.groups[0]).toEqual({start:0,count:3,materialIndex:1}); expect(g.getAttribute('uv').getX(0)).toBe(before);
  });
});
