// Placement check: 3D math. No docs and no three.js source. Write all twelve, then run
// npm run pick -- done, once: the first attempt is the one that counts.
//
// Directions and normals can be any length unless a comment says otherwise. None of the functions
// may change the vectors they're handed.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// Point vs direction: where something is after moving at `velocity` for `seconds`.
export function moveFor(position: Vector3, velocity: Vector3, seconds: number): Answer<Vector3> {
  return null;
}

// Length: whether `b` is within `radius` of `a` (exactly `radius` counts).
export function inRange(a: Vector3, b: Vector3, radius: number): Answer<boolean> {
  return null;
}

// Normalize: the length-1 direction from `from` to `to`, or (0, 0, 0) when they're the same place.
export function aimAt(from: Vector3, to: Vector3): Answer<Vector3> {
  return null;
}

// Dot product: whether `target` is behind something at `position` facing `forward`.
export function isBehind(position: Vector3, forward: Vector3, target: Vector3): Answer<boolean> {
  return null;
}

// Cross product: the length-1 direction a triangle faces. Its corners are counter-clockwise as seen
// from the front.
export function faceNormal(a: Vector3, b: Vector3, c: Vector3): Answer<Vector3> {
  return null;
}

// Projection and rejection: the velocity sliding along a wall when it's moving into the wall, and
// unchanged when it's moving away. `wallNormal` is the way the wall faces.
export function slideAlongWall(velocity: Vector3, wallNormal: Vector3): Answer<Vector3> {
  return null;
}

// Reflection: the velocity bounced off a surface facing `normal`.
export function bounce(velocity: Vector3, normal: Vector3): Answer<Vector3> {
  return null;
}

// Lerp: where something moving from `start` to `end` over `duration` seconds is at `elapsed`
// seconds, stopping at `end` once it gets there.
export function positionAt(start: Vector3, end: Vector3, elapsed: number, duration: number): Answer<Vector3> {
  return null;
}

// Angle between and signed angle: the angle in radians from `forward` to `toTarget` around +Y,
// positive to the left and negative to the right.
export function turnToward(forward: Vector3, toTarget: Vector3): Answer<number> {
  return null;
}

// Spherical coordinates: where an orbit camera sits, `radius` from `target`, with phi and theta in
// radians as three.js measures them.
export function orbitPosition(target: Vector3, radius: number, phi: number, theta: number): Answer<Vector3> {
  return null;
}

// Scalar triple product: whether a set of axes is mirrored.
export function isMirrored(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Answer<boolean> {
  return null;
}

// Floating-point tolerance: whether two positions match, allowing for rounding (within 0.000001).
export function samePlace(p: Vector3, q: Vector3): Answer<boolean> {
  return null;
}
