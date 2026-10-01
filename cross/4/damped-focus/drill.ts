import type { Answer } from '@harness/drill';
import { Object3D, PerspectiveCamera, Vector3 } from 'three';

export interface Focus { position: Vector3; target: Vector3 }
export function focusStep(camera: PerspectiveCamera, currentTarget: Vector3, part: Object3D, seconds: number): Answer<Focus> {
  return null;
}
