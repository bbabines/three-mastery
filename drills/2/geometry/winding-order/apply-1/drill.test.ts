import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { reverseWinding } from './drill';

describe('geometry.winding-order', () => {
  it('return a triangle mesh copy with each triangle’s vertex order reversed so its visible front side flips', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3)); g.setIndex([0,1,2]);
    const copy=answered(reverseWinding(g));
    expect(copy.index!.array).toEqual(new Uint16Array([0,2,1])); expect(g.index!.array).toEqual(new Uint16Array([0,1,2]));
    const normals=(mesh:THREE.BufferGeometry)=>{ const p=mesh.getAttribute('position'); const idx=mesh.index; return THREE.Triangle.getNormal(...([0,1,2].map(i=>new THREE.Vector3().fromBufferAttribute(p,idx?.getX(i)??i)) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]),new THREE.Vector3()); };
    expect(normals(copy).dot(normals(g))).toBeCloseTo(-1,6);
    const withoutIndex = g.toNonIndexed();
    const reversed = answered(reverseWinding(withoutIndex));
    expect(normals(reversed).dot(normals(withoutIndex))).toBeCloseTo(-1, 6);
  });
});
