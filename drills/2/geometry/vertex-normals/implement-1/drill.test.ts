import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { smoothNormals } from './drill';

describe('geometry.vertex-normals', () => {
  it('rebuild a mesh’s per-vertex normals for smooth shading after its positions change, preserving the original geometry', () => {
    const g=new THREE.SphereGeometry(1,8,4); g.deleteAttribute('normal'); const copy=answered(smoothNormals(g));
    expect(copy.getAttribute('normal')).toBeDefined(); expect(g.getAttribute('normal')).toBeUndefined();
    const n=new THREE.Vector3().fromBufferAttribute(copy.getAttribute('normal'),3); expect(n.length()).toBeCloseTo(1,4);
  });
});
