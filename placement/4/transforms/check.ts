// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// object3d-tour: Put a child under a parent for shared transforms.
export function makeHierarchy(parent: THREE.Object3D, child: THREE.Object3D): Answer<THREE.Object3D> {
  return null;
}

// local-vs-world: Convert a local point into the world.
export function worldPoint(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// matrix-vs-matrixworld: Read a nested object's current world position.
export function worldTranslation(object: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}

// update-timing: Move then read the updated world position in the same step.
export function movedWorldPoint(object: THREE.Object3D, nextLocal: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// trs-order: Apply position, rotation, and scale in three.js order.
export function pointAfterTrs(point: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// compose-decompose: Read the position component of a composed transform.
export function translationOf(matrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}

// points-vs-directions: Turn a local direction into a world direction without translation.
export function worldDirection(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// inverse-matrices: Turn a world point into the object's local space.
export function localPoint(object: THREE.Object3D, world: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// add-vs-attach: Reparent a child while preserving its world transform.
export function keepWorldOnReparent(child: THREE.Object3D, newParent: THREE.Object3D): Answer<THREE.Object3D> {
  return null;
}

// pivots: Find the world position of an object's local origin after its pivot acts.
export function pivotedOrigin(object: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}

// normal-matrix: Keep a surface normal perpendicular after uneven scale.
export function normalInWorld(object: THREE.Object3D, normal: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// negative-scale: Detect a mirrored transform from its determinant.
export function reversesHandedness(world: THREE.Matrix4): Answer<boolean> {
  return null;
}
