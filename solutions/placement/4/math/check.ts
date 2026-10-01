import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function translatePoint(point: THREE.Vector3, offset: THREE.Vector3): Answer<THREE.Vector3> {
  return point.clone().add(offset);
}

export function withinRadius(a: THREE.Vector3, b: THREE.Vector3, radius: number): Answer<boolean> {
  return a.distanceToSquared(b) <= radius*radius;
}

export function safeHeading(from: THREE.Vector3, to: THREE.Vector3): Answer<THREE.Vector3> {
  return to.clone().sub(from).normalize();
}

export function movingToward(velocity: THREE.Vector3, toTarget: THREE.Vector3): Answer<boolean> {
  return velocity.dot(toTarget) > 0;
}

export function triangleDirection(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Answer<THREE.Vector3> {
  return new THREE.Triangle(a,b,c).getNormal(new THREE.Vector3());
}

export function allowedMotion(motion: THREE.Vector3, axis: THREE.Vector3): Answer<THREE.Vector3> {
  return motion.clone().projectOnVector(axis);
}

export function reflectedMotion(motion: THREE.Vector3, normal: THREE.Vector3): Answer<THREE.Vector3> {
  return motion.clone().reflect(normal.clone().normalize());
}

export function clampedBlend(start: THREE.Vector3, end: THREE.Vector3, fraction: number): Answer<THREE.Vector3> {
  return start.clone().lerp(end,THREE.MathUtils.clamp(fraction,0,1));
}

export function signedYaw(from: THREE.Vector3, to: THREE.Vector3): Answer<number> {
  return Math.atan2(new THREE.Vector3().crossVectors(from,to).y,from.dot(to));
}

export function orbitOffset(radius: number, phi: number, theta: number): Answer<THREE.Vector3> {
  return new THREE.Vector3().setFromSphericalCoords(radius,phi,theta);
}

export function isLeftHanded(x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3): Answer<boolean> {
  return new THREE.Vector3().crossVectors(x,y).dot(z) < 0;
}

export function sameSpot(a: THREE.Vector3, b: THREE.Vector3, tolerance: number): Answer<boolean> {
  return a.distanceToSquared(b) <= tolerance*tolerance;
}
