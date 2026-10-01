import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Ray: The point at that distance along the forward ray.
export function pointAhead(ray: THREE.Ray, distance: number): Answer<THREE.Vector3> {
  return ray.at(distance, new THREE.Vector3());
}

// Ray from pointer: The pointer as canvas-relative NDC.
export function pointerNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }): Answer<THREE.Vector2> {
  return new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, 1 - ((clientY - rect.top) / rect.height) * 2);
}

// Intersection anatomy: The hit face normal in world space.
export function worldHitNormal(normal: THREE.Vector3, object: THREE.Object3D): Answer<THREE.Vector3> {
  object.updateMatrixWorld(true);
  return normal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(object.matrixWorld));
}

// Filtering: The nearest name among only the target objects.
export function firstTargetName(ray: THREE.Ray, targets: THREE.Object3D[]): Answer<string> {
  const caster = new THREE.Raycaster(ray.origin, ray.direction);
  return caster.intersectObjects(targets, true)[0]?.object.name ?? '';
}

// Ray–plane: The world hit point or ray origin on a miss.
export function planeDragPoint(ray: THREE.Ray, plane: THREE.Plane): Answer<THREE.Vector3> {
  return ray.intersectPlane(plane, new THREE.Vector3()) ?? ray.origin.clone();
}

// Ray–sphere: The hotspot hit in front of the ray, or its origin on a miss.
export function hotspotPoint(ray: THREE.Ray, sphere: THREE.Sphere): Answer<THREE.Vector3> {
  return ray.intersectSphere(sphere, new THREE.Vector3()) ?? ray.origin.clone();
}

// Ray–triangle: The front-face triangle hit or ray origin on a miss.
export function frontFacePoint(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Answer<THREE.Vector3> {
  return ray.intersectTriangle(a, b, c, true, new THREE.Vector3()) ?? ray.origin.clone();
}

// Ray–AABB: Whether the forward ray touches the box.
export function rayTouchesBox(ray: THREE.Ray, box: THREE.Box3): Answer<boolean> {
  return ray.intersectsBox(box);
}

// Bounds primitives: Whether the point lies on the positive side of the plane.
export function positiveSide(plane: THREE.Plane, point: THREE.Vector3): Answer<boolean> {
  return plane.distanceToPoint(point) > 0;
}

// AABB vs OBB: The axis-aligned world box size of a rotated Mesh.
export function worldAabbSize(mesh: THREE.Mesh): Answer<THREE.Vector3> {
  mesh.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(mesh, true).getSize(new THREE.Vector3());
}

// Closest-point queries: The nearest point on the finite edge.
export function snapToEdge(point: THREE.Vector3, edge: THREE.Line3): Answer<THREE.Vector3> {
  return edge.closestPointToPoint(point, true, new THREE.Vector3());
}

// BVH: IDs of leaf boxes touched by the ray.
export function candidateLeafIds(ray: THREE.Ray, root: THREE.Object3D): Answer<string[]> {
  const ids: string[] = [];
  const visit = (node: THREE.Object3D) => { const box = node.userData.bounds as THREE.Box3; if (!ray.intersectsBox(box)) return; if (typeof node.userData.leafId === 'string') ids.push(node.userData.leafId); else for (const child of node.children) visit(child); };
  visit(root);
  return ids;
}
