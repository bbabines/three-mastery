import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { candidateLeafIds } from './drill';

describe('candidateLeafIds', () => {
it('prunes a missed branch and keeps intersected leaves', () => {
    const make = (minX: number, maxX: number, id?: string) => { const n = new THREE.Group(); n.userData.bounds = new THREE.Box3(new THREE.Vector3(minX,-1,-1),new THREE.Vector3(maxX,1,1)); if (id) n.userData.leafId=id; return n; };
    const root = make(-5,5), near = make(-5,-1), far = make(1,5); root.add(near,far); near.add(make(-4,-2,'left')); far.add(make(2,4,'right'));
    const ray = new THREE.Ray(new THREE.Vector3(-6,0,0),new THREE.Vector3(1,0,0));
    expect(answered(candidateLeafIds(ray,root))).toEqual(['left','right']);
    const miss = new THREE.Ray(new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0));
    expect(answered(candidateLeafIds(miss,root))).toEqual(['right']);
  });
});
