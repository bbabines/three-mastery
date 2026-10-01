import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { vertexAt } from './drill';

describe('geometry.buffer-attribute', () => {
  it('repairs the reported symptom for a general case', () => {
    const p=new THREE.Float32BufferAttribute([1,2,3, 4,5,6, 7,8,9],3);
    const before = Array.from(p.array);
    expect(vertexAt(p,2).distanceTo(new THREE.Vector3(7,8,9))).toBeLessThan(1e-6);
    expect(vertexAt(p,1).distanceTo(new THREE.Vector3(4,5,6))).toBeLessThan(1e-6);
    expect(Array.from(p.array)).toEqual(before);
  });
});
