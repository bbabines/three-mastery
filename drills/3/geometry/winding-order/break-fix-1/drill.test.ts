import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { flipFrontFace } from './drill';

describe('geometry.winding-order', () => {
  it('repairs the reported symptom for a general case', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3)); g.computeVertexNormals();
    const f=flipFrontFace(g), p=f.getAttribute('position'); const n=THREE.Triangle.getNormal(...([0,1,2].map(i=>new THREE.Vector3().fromBufferAttribute(p,i)) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]),new THREE.Vector3());
    expect(n.z).toBeLessThan(0); expect(new THREE.Vector3().fromBufferAttribute(g.getAttribute('position'),1).x).toBe(1);
  });
});
