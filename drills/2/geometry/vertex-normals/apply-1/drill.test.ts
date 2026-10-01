import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { hardEdges } from './drill';

describe('geometry.vertex-normals', () => {
  it('give each triangle its own vertices and face normals to make a low-poly model show hard edges', () => {
    const g=new THREE.BoxGeometry(); const copy=answered(hardEdges(g));
    expect(copy.index).toBeNull(); expect(copy.getAttribute('normal').count).toBe(copy.getAttribute('position').count);
    const n=copy.getAttribute('normal');
    for(let i=0;i<n.count;i+=3) { const a=new THREE.Vector3().fromBufferAttribute(n,i); for(const j of [1,2]) expect(a.distanceTo(new THREE.Vector3().fromBufferAttribute(n,i+j))).toBeLessThan(1e-6); }
  });
});
