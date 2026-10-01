import * as THREE from 'three';
import { expect } from 'vitest';
import type { planeHit } from './drill';

export function checkRayPlane(subject: typeof planeHit): void {
  const plane=new THREE.Plane(new THREE.Vector3(0,1,1).normalize(),-1), ray=new THREE.Ray(new THREE.Vector3(1,4,3),new THREE.Vector3(1,-1,-1).normalize());
  const got=subject(ray,plane), expected=ray.intersectPlane(plane,new THREE.Vector3()); expect(got).not.toBeNull(); expect(got!.distanceTo(expected!)).toBeLessThan(1e-6);
}
