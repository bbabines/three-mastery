import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { triangleVertices } from './drill';

describe('geometry.indexed', () => {
  it('read the three local-space corners of one triangle from either indexed or non-indexed geometry', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, 2,0,0, 2,2,0, 0,2,0],3)); g.setIndex([0,1,2,0,2,3]);
    const [a,b,c]=answered(triangleVertices(g,1));
    expect(a.distanceTo(new THREE.Vector3(0,0,0))).toBeLessThan(1e-6);
    expect(b.distanceTo(new THREE.Vector3(2,2,0))).toBeLessThan(1e-6);
    expect(c.distanceTo(new THREE.Vector3(0,2,0))).toBeLessThan(1e-6);
  });
});
