// Reference answer for drills/2/math/dot-product/apply-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export function facesCamera(spot: Vector3, normal: Vector3, cameraPosition: Vector3): Answer<boolean> {
  const toCamera = cameraPosition.clone().sub(spot);
  return normal.dot(toCamera) > 0;
}
