import type { Answer } from '@harness/drill';
import { Object3D, Raycaster } from 'three';

export interface RaycastMeasure { hierarchyHits: number; denseHits: number; hierarchyMs: number; denseMs: number }
export function measureRaycasts(raycaster: Raycaster, hierarchy: Object3D, dense: Object3D, repeats: number): Answer<RaycastMeasure> {
  return null;
}
