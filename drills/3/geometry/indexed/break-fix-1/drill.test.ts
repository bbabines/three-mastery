import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { triangleAt } from './drill';

describe('geometry.indexed', () => {
  it('repairs the reported symptom for a general case', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, 2,0,0, 2,2,0, 0,2,0],3)); g.setIndex([0,1,2,0,2,3]);
    const got=triangleAt(g,1), expected=[0,2,3].map(i=>new THREE.Vector3().fromBufferAttribute(g.getAttribute('position'),i));
    got.forEach((v,i)=>expect(v.distanceTo(expected[i])).toBeLessThan(1e-6));
  });
});
