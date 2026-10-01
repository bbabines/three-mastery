import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { flatNormals } from './drill';

describe('geometry.vertex-normals', () => {
  it('repairs the reported symptom for a general case', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0,0,1,0,0,0,1],3)); g.setIndex([0,1,2,0,3,1]);
    const flat=flatNormals(g); expect(flat.index).toBeNull(); const n=flat.getAttribute('normal');
    const first=new THREE.Vector3().fromBufferAttribute(n,0), second=new THREE.Vector3().fromBufferAttribute(n,3);
    expect(first.angleTo(second)).toBeGreaterThan(0.1);
  });
});
