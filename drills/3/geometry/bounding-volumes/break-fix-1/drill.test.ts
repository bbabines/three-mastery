import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { deformAndBound } from './drill';

describe('geometry.bounding-volumes', () => {
  it('repairs the reported symptom for a general case', () => {
    const g=new THREE.BoxGeometry(1,1,1); g.computeBoundingSphere(); const old=g.boundingSphere!.radius;
    const moved=new THREE.Vector3(20,0,0), sphere=deformAndBound(g,0,moved);
    expect(sphere.radius).toBeGreaterThan(old); expect(sphere.containsPoint(moved)).toBe(true);
  });
});
