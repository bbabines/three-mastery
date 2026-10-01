// Reference answers for placement/3/math/check.ts.
import type { Answer } from '@harness/drill';
import { MathUtils, Spherical, Triangle, Vector3 } from 'three';

const UP = new Vector3(0, 1, 0);

export function moveFor(position: Vector3, velocity: Vector3, seconds: number): Answer<Vector3> {
  return position.clone().addScaledVector(velocity, seconds);
}

export function inRange(a: Vector3, b: Vector3, radius: number): Answer<boolean> {
  return a.distanceToSquared(b) <= radius * radius;
}

export function aimAt(from: Vector3, to: Vector3): Answer<Vector3> {
  return to.clone().sub(from).normalize();
}

export function isBehind(position: Vector3, forward: Vector3, target: Vector3): Answer<boolean> {
  return forward.dot(target.clone().sub(position)) < 0;
}

export function faceNormal(a: Vector3, b: Vector3, c: Vector3): Answer<Vector3> {
  return Triangle.getNormal(a, b, c, new Vector3());
}

export function slideAlongWall(velocity: Vector3, wallNormal: Vector3): Answer<Vector3> {
  if (velocity.dot(wallNormal) >= 0) return velocity.clone();
  return velocity.clone().projectOnPlane(wallNormal);
}

export function bounce(velocity: Vector3, normal: Vector3): Answer<Vector3> {
  return velocity.clone().reflect(normal.clone().normalize());
}

export function positionAt(start: Vector3, end: Vector3, elapsed: number, duration: number): Answer<Vector3> {
  return start.clone().lerp(end, MathUtils.clamp(elapsed / duration, 0, 1));
}

export function turnToward(forward: Vector3, toTarget: Vector3): Answer<number> {
  const cross = new Vector3().crossVectors(forward, toTarget);
  return Math.atan2(cross.dot(UP), forward.dot(toTarget));
}

export function orbitPosition(target: Vector3, radius: number, phi: number, theta: number): Answer<Vector3> {
  return new Vector3().setFromSpherical(new Spherical(radius, phi, theta)).add(target);
}

export function isMirrored(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Answer<boolean> {
  return xAxis.dot(new Vector3().crossVectors(yAxis, zAxis)) < 0;
}

export function samePlace(p: Vector3, q: Vector3): Answer<boolean> {
  return p.distanceTo(q) < 1e-6;
}
