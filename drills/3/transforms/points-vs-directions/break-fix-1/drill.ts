import { Object3D, Vector3 } from 'three';

// Convert part-local velocity to world space, keeping the speed effect of scale.
export function worldVelocity(part: Object3D, localVelocity: Vector3): Vector3 {
  part.updateWorldMatrix(true, false);
  return localVelocity.clone().applyMatrix4(part.matrixWorld);
}
