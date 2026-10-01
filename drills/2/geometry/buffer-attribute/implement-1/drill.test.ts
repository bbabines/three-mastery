import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { vertexPosition } from './drill';

describe('geometry.buffer-attribute', () => {
  it('read one vertex’s xyz position from a flat position attribute using its item size', () => {
    const attr=new THREE.BufferAttribute(new Float32Array([1,2,3,4,5,6,7,8,9]),3);
    expect(answered(vertexPosition(attr,2)).distanceTo(new THREE.Vector3(7,8,9))).toBeLessThan(1e-6);
    expect(answered(vertexPosition(attr,1)).distanceTo(new THREE.Vector3(4,5,6))).toBeLessThan(1e-6);
  });
});
