// Reference answer for drills/2/transforms/local-vs-world/implement-1.
import type { Answer } from '@harness/drill';
import { Object3D, Vector3 } from 'three';

export function worldGap(a: Object3D, b: Object3D): Answer<number> {
  // getWorldPosition refreshes the object and its parents first, so a move a line earlier counts.
  return a.getWorldPosition(new Vector3()).distanceTo(b.getWorldPosition(new Vector3()));
}

export function nearestBin(robot: Object3D, bins: Object3D[]): Answer<number> {
  const gaps = bins.map((bin) => worldGap(robot, bin)!);
  return gaps.indexOf(Math.min(...gaps));
}
