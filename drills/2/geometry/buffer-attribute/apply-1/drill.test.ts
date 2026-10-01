import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { vertexColor } from './drill';

describe('geometry.buffer-attribute', () => {
  it('read a mesh vertex’s rgb color from a packed color attribute without confusing flat array offsets with vertex numbers', () => {
    const attr=new THREE.BufferAttribute(new Float32Array([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]),3);
    expect(answered(vertexColor(attr,1)).distanceTo(new THREE.Vector3(0.4,0.5,0.6))).toBeLessThan(1e-6);
    expect(attr.count).toBe(3);
  });
});
