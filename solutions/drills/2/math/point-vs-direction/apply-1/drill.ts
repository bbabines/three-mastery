// Reference answer for drills/2/math/point-vs-direction/apply-1.
import type { Answer } from '@harness/drill';
import { Matrix4, Vector3 } from 'three';

export function hotspotInWorld(hotspot: Vector3, matrixWorld: Matrix4): Answer<Vector3> {
  return hotspot.clone().applyMatrix4(matrixWorld);
}

export function beamInWorld(beam: Vector3, matrixWorld: Matrix4): Answer<Vector3> {
  return beam.clone().transformDirection(matrixWorld);
}
