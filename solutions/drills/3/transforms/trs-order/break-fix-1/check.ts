import { expect } from 'vitest';
import { Object3D, Quaternion, Vector3 } from 'three';
import type { PosePreview } from './drill';

type Preview = (position: Vector3, rotation: Quaternion, scale: Vector3, localPoint: Vector3) => PosePreview;

export function checkPose(posePreview: Preview): void {
  const position = new Vector3(3, -1, 2);
  const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.7);
  const scale = new Vector3(3, 1, 0.5);
  const point = new Vector3(0.3, 0.4, 0.5);
  const part = new Object3D();
  part.position.copy(position);
  part.quaternion.copy(rotation);
  part.scale.copy(scale);
  const expected = part.localToWorld(point.clone());
  expect(posePreview(position, rotation, scale, point).worldPoint.distanceTo(expected)).toBeLessThan(1e-5);
}
