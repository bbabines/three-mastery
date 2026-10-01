// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// ray: Find a point forward along a ray.
export function pointAlongRay(ray: THREE.Ray, distance: number): Answer<THREE.Vector3> {
  return null;
}

// ray-from-pointer: Build a world ray from a pointer's NDC position.
export function pointerRay(camera: THREE.Camera, ndc: THREE.Vector2): Answer<THREE.Ray> {
  return null;
}

// intersection-anatomy: Take the world-space hit point from an intersection.
export function hitPoint(hit: THREE.Intersection): Answer<THREE.Vector3> {
  return null;
}

// filtering: Raycast only a chosen target list, including descendants.
export function selectableHits(raycaster: THREE.Raycaster, roots: THREE.Object3D[]): Answer<THREE.Intersection[]> {
  return null;
}

// ray-plane: Find a ray hit on a horizontal plane.
export function floorPoint(ray: THREE.Ray, height: number): Answer<THREE.Vector3 | null> {
  return null;
}

// ray-sphere: Find the first point where a ray meets a sphere.
export function spherePoint(ray: THREE.Ray, sphere: THREE.Sphere): Answer<THREE.Vector3 | null> {
  return null;
}

// ray-triangle: Intersect a ray with a front-facing triangle.
export function trianglePoint(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Answer<THREE.Vector3 | null> {
  return null;
}

// ray-aabb: Find a ray's first hit on an axis-aligned box.
export function boxPoint(ray: THREE.Ray, box: THREE.Box3): Answer<THREE.Vector3 | null> {
  return null;
}

// bounds-primitives: Find a world bounding sphere for nested objects.
export function objectSphere(object: THREE.Object3D): Answer<THREE.Sphere> {
  return null;
}

// aabb-vs-obb: Return an axis-aligned world box after a turn.
export function worldAabb(object: THREE.Object3D): Answer<THREE.Box3> {
  return null;
}

// closest-point: Find the closest point on a finite segment.
export function nearestOnSegment(line: THREE.Line3, point: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// bvh: Keep the nearest hit from an accelerated query.
export function nearestAcceleratedHit(hits: THREE.Intersection[]): Answer<THREE.Intersection | undefined> {
  return null;
}
