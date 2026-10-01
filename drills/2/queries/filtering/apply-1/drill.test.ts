import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { firstTargetName, rayTouchesBox } from './drill';

describe('firstTargetName', () => {
it('ignores an unlisted helper even when it is closer', () => {
    const helper = new THREE.Mesh(new THREE.BoxGeometry()); helper.name = 'helper'; helper.position.z = 2;
    const target = new THREE.Mesh(new THREE.BoxGeometry()); target.name = 'part';
    helper.updateMatrixWorld(); target.updateMatrixWorld();
    const ray = new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
    expectExact(firstTargetName(ray, [target]), 'part');
  });
});

describe('rayTouchesBox', () => {
it('hits a box from inside and misses one behind the ray', () => {
    const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
    expectExact(rayTouchesBox(new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(1, 0, 0)), box), true);
    expectExact(rayTouchesBox(new THREE.Ray(new THREE.Vector3(4, 0, 0), new THREE.Vector3(1, 0, 0)), box), false);
  });
});
