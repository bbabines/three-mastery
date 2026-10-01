import type { Answer } from '@harness/drill';
import { Object3D, Raycaster } from 'three';

export interface RaycastMeasure { hierarchyHits: number; denseHits: number; hierarchyMs: number; denseMs: number }
export function measureRaycasts(raycaster: Raycaster, hierarchy: Object3D, dense: Object3D, repeats: number): Answer<RaycastMeasure> {
  let hierarchyHits = 0, denseHits = 0;
  const startHierarchy = performance.now();
  for (let i = 0; i < repeats; i++) hierarchyHits += raycaster.intersectObject(hierarchy, true).length;
  const hierarchyMs = performance.now() - startHierarchy;
  const startDense = performance.now();
  for (let i = 0; i < repeats; i++) denseHits += raycaster.intersectObject(dense, false).length;
  return { hierarchyHits, denseHits, hierarchyMs, denseMs: performance.now() - startDense };
}
