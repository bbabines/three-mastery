import type { PerspectiveCamera, Quaternion, Vector3 } from 'three';

type Aim = (camera: PerspectiveCamera, target: Vector3, worldUp: Vector3) => Quaternion;

export function checkUp(_aimCamera: Aim): void {
  throw new Error('Write the regression check in check.ts');
}
