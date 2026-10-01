import * as THREE from 'three';
import { expect } from 'vitest';
import type { deformAndBound } from './drill';

export function checkBoundingVolumes(subject: typeof deformAndBound): void {
  const g=new THREE.PlaneGeometry(); g.computeBoundingSphere(); const far=new THREE.Vector3(0,0,30);
  const sphere=subject(g,2,far); expect(sphere.containsPoint(far)).toBe(true); expect(sphere.radius).toBeGreaterThan(10);
}
