import type { Quaternion } from 'three';

type Orientation = (yaw: number, pitch: number, roll: number) => Quaternion;

export function checkEuler(_cameraOrientation: Orientation): void {
  throw new Error('Write the regression check in check.ts');
}
