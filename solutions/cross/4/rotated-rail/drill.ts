import type { Answer } from '@harness/drill';
import { Object3D, Vector3 } from 'three';

export function railMotion(motion: Vector3, rail: Object3D): Answer<Vector3> {
  rail.updateWorldMatrix(true, false);
  const axis = new Vector3(1, 0, 0).transformDirection(rail.matrixWorld);
  return motion.clone().projectOnVector(axis);
}
