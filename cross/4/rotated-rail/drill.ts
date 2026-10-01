import type { Answer } from '@harness/drill';
import { Object3D, Vector3 } from 'three';

// Keep only world-space motion along the rail's local +X axis.
export function railMotion(motion: Vector3, rail: Object3D): Answer<Vector3> {
  return null;
}
