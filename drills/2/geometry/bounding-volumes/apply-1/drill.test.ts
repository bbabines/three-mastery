import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { freshBoundingSphere } from './drill';

describe('geometry.bounding-volumes', () => {
  it('recompute a geometry’s local-space bounding sphere after direct edits to its position array', () => {
    const g=new THREE.BoxGeometry(1,1,1); g.computeBoundingSphere(); const old=g.boundingSphere!.radius;
    const p=g.getAttribute('position'); p.setXYZ(0,20,0,0);
    const sphere=answered(freshBoundingSphere(g));
    expect(sphere.radius).toBeGreaterThan(old); expect(sphere.containsPoint(new THREE.Vector3(20,0,0))).toBe(true);
  });
});
