import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { boxTestsForRay } from './drill';

describe('boxTestsForRay', () => {
it('counts the failed test but never visits its children', () => {
    const make = (x: number) => { const n = new THREE.Group(); n.userData.bounds = new THREE.Box3(new THREE.Vector3(x,-1,-1),new THREE.Vector3(x+1,1,1)); return n; };
    const root = make(0), hit = make(0), miss = make(-8); miss.userData.bounds.translate(new THREE.Vector3(0,5,0)); root.add(hit,miss); miss.add(make(-8),make(-7));
    const ray = new THREE.Ray(new THREE.Vector3(4,0,0),new THREE.Vector3(-1,0,0));
    expectNumber(boxTestsForRay(ray,root), 3);
    const away = new THREE.Ray(new THREE.Vector3(4,0,0),new THREE.Vector3(1,0,0));
    expectNumber(boxTestsForRay(away,root), 1);
  });
});
