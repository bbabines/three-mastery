import type { Object3D, Vector3 } from 'three';

type Velocity = (part: Object3D, localVelocity: Vector3) => Vector3;

export function checkVelocity(_worldVelocity: Velocity): void {
  throw new Error('Write the regression check in check.ts');
}
