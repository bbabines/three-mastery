import { Matrix4, Quaternion, Vector3 } from 'three';

export interface PosePreview { worldPoint: Vector3; recoveredScale: Vector3 }

export function posePreview(position: Vector3, rotation: Quaternion, scale: Vector3, localPoint: Vector3): PosePreview {
  const matrix = new Matrix4().compose(position, rotation, scale);
  const recoveredScale = new Vector3();
  matrix.decompose(new Vector3(), new Quaternion(), recoveredScale);
  return { worldPoint: localPoint.clone().applyMatrix4(matrix), recoveredScale };
}
