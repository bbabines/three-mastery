import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { wallDragDelta } from './drill';

describe('wallDragDelta', () => {
it('returns wall-plane motion, not the absolute hit point', () => {
    const wall = new THREE.Plane(new THREE.Vector3(0,0,1),-1);
    const first = new THREE.Ray(new THREE.Vector3(0,1,4),new THREE.Vector3(0,0,-1));
    const next = new THREE.Ray(new THREE.Vector3(2,3,4),new THREE.Vector3(0,0,-1));
    expectVector(wallDragDelta(first,next,wall),new THREE.Vector3(2,2,0));
    expectVector(wallDragDelta(new THREE.Ray(new THREE.Vector3(),new THREE.Vector3(1,0,0)),next,wall),new THREE.Vector3());
  });
});
