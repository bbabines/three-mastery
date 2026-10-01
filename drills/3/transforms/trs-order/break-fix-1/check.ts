import type { Quaternion, Vector3 } from 'three';
import type { PosePreview } from './drill';

type Preview = (position: Vector3, rotation: Quaternion, scale: Vector3, localPoint: Vector3) => PosePreview;

export function checkPose(_posePreview: Preview): void {
  throw new Error('Write the regression check in check.ts');
}
