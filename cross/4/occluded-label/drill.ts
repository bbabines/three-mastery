import type { Answer } from '@harness/drill';
import { Object3D, PerspectiveCamera, Vector3 } from 'three';

export interface LabelState { x: number; y: number; worldHeight: number; visible: boolean }
export function labelState(point: Vector3, camera: PerspectiveCamera, width: number, height: number, pixelsTall: number, blockers: Object3D[]): Answer<LabelState> {
  return null;
}
