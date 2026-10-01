import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { triangleAt } from './drill';

describe('geometry.indexed', () => {
  it('repairs the reported symptom for a general case', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, 2,0,0, 2,2,0, 0,2,0],3)); g.setIndex([0,1,2,0,2,3]);
    const before = g.clone();
    const got=triangleAt(g,1), expected=[0,2,3].map(i=>new THREE.Vector3().fromBufferAttribute(g.getAttribute('position'),i));
    got.forEach((v,i)=>expect(v.distanceTo(expected[i])).toBeLessThan(1e-6));
    expect(Array.from(g.index!.array)).toEqual(Array.from(before.index!.array));
    expect(Array.from(g.getAttribute('position').array)).toEqual(Array.from(before.getAttribute('position').array));
    const separate = g.toNonIndexed();
    const nonIndexed = triangleAt(separate,1);
    nonIndexed.forEach((point,i) => expect(point.distanceTo(new THREE.Vector3().fromBufferAttribute(separate.getAttribute('position'),3+i))).toBeLessThan(1e-6));
  });
});
