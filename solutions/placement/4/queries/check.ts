import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function pointAlongRay(ray: THREE.Ray, distance: number): Answer<THREE.Vector3> {
  return ray.at(distance,new THREE.Vector3());
}

export function pointerRay(camera: THREE.Camera, ndc: THREE.Vector2): Answer<THREE.Ray> {
  camera.updateMatrixWorld(true); const caster=new THREE.Raycaster(); caster.setFromCamera(ndc,camera); return caster.ray.clone();
}

export function hitPoint(hit: THREE.Intersection): Answer<THREE.Vector3> {
  return hit.point.clone();
}

export function selectableHits(raycaster: THREE.Raycaster, roots: THREE.Object3D[]): Answer<THREE.Intersection[]> {
  return raycaster.intersectObjects(roots,true);
}

export function floorPoint(ray: THREE.Ray, height: number): Answer<THREE.Vector3 | null> {
  return ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-height),new THREE.Vector3());
}

export function spherePoint(ray: THREE.Ray, sphere: THREE.Sphere): Answer<THREE.Vector3 | null> {
  return ray.intersectSphere(sphere,new THREE.Vector3());
}

export function trianglePoint(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Answer<THREE.Vector3 | null> {
  return ray.intersectTriangle(a,b,c,true,new THREE.Vector3());
}

export function boxPoint(ray: THREE.Ray, box: THREE.Box3): Answer<THREE.Vector3 | null> {
  return ray.intersectBox(box,new THREE.Vector3());
}

export function objectSphere(object: THREE.Object3D): Answer<THREE.Sphere> {
  object.updateWorldMatrix(true,true); return new THREE.Box3().setFromObject(object,true).getBoundingSphere(new THREE.Sphere());
}

export function worldAabb(object: THREE.Object3D): Answer<THREE.Box3> {
  object.updateWorldMatrix(true,true); return new THREE.Box3().setFromObject(object,true);
}

export function nearestOnSegment(line: THREE.Line3, point: THREE.Vector3): Answer<THREE.Vector3> {
  return line.closestPointToPoint(point,true,new THREE.Vector3());
}

export function nearestAcceleratedHit(hits: THREE.Intersection[]): Answer<THREE.Intersection | undefined> {
  return hits.reduce<THREE.Intersection|undefined>((best,hit)=>!best||hit.distance<best.distance?hit:best,undefined);
}
