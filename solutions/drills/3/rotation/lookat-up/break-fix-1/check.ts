import { expect } from 'vitest';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';

type Aim = (camera: PerspectiveCamera, target: Vector3, worldUp: Vector3) => Quaternion;

export function checkUp(aimCamera: Aim): void {
  const camera = new PerspectiveCamera();
  camera.position.set(1, 5, 0.3);
  const target = new Vector3(0, 0, 0), up = new Vector3(0, 0, -1);
  const reference = new PerspectiveCamera();
  reference.position.copy(camera.position);
  reference.up.copy(up);
  reference.lookAt(target);
  expect(aimCamera(camera, target, up).angleTo(reference.quaternion)).toBeLessThan(1e-5);
}
