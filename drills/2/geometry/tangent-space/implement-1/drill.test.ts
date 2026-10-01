import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { normalFromMap } from './drill';

describe('geometry.tangent-space', () => {
  it('turn a tangent-space normal-map sample from 0–1 colors into a world-space unit normal using the surface tbn basis', () => {
    const tangent=new THREE.Vector3(1,0,0), bitangent=new THREE.Vector3(0,1,0), normal=new THREE.Vector3(0,0,1);
    expect(answered(normalFromMap(new THREE.Vector3(0.5,0.5,1),tangent,bitangent,normal)).distanceTo(normal)).toBeLessThan(1e-6);
    const sample=new THREE.Vector3(0.8,0.2,0.9); const expected=new THREE.Vector3(0.6,-0.6,0.8).normalize();
    expect(answered(normalFromMap(sample,tangent,bitangent,normal)).distanceTo(expected)).toBeLessThan(1e-6);
    expect(sample.equals(new THREE.Vector3(0.8,0.2,0.9))).toBe(true);
    expect(tangent.equals(new THREE.Vector3(1,0,0))).toBe(true);
    expect(bitangent.equals(new THREE.Vector3(0,1,0))).toBe(true);
    expect(normal.equals(new THREE.Vector3(0,0,1))).toBe(true);
  });
});
