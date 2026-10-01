import type { Answer } from '@harness/drill';
import { Quaternion, Vector3 } from 'three';

// Return the orientation for a plane whose +Z face points from position toward cameraPosition.
// With lockY, it may turn around Y but must remain upright. Do not mutate either input.
export function faceCamera(position: Vector3, cameraPosition: Vector3, lockY: boolean): Answer<Quaternion> {
  return null;
}
