import type { Answer } from '@harness/drill';
import { Box3, MathUtils, Object3D, PerspectiveCamera, Sphere, Vector3 } from 'three';

export interface Focus { position: Vector3; target: Vector3 }
export function focusStep(camera: PerspectiveCamera, currentTarget: Vector3, part: Object3D, seconds: number): Answer<Focus> {
  part.updateWorldMatrix(true, true);
  const sphere = new Box3().setFromObject(part, true).getBoundingSphere(new Sphere());
  const halfV = MathUtils.degToRad(camera.fov) / 2;
  const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
  const distance = Math.max(sphere.radius / Math.sin(Math.min(halfV, halfH)) * 1.2, camera.near * 2);
  const direction = camera.position.clone().sub(currentTarget).normalize();
  if (direction.lengthSq() === 0) direction.set(0,0,1);
  const desiredPosition = sphere.center.clone().addScaledVector(direction, distance);
  const alpha = 1 - Math.exp(-6 * Math.max(0, seconds));
  return { position: camera.position.clone().lerp(desiredPosition, alpha), target: currentTarget.clone().lerp(sphere.center, alpha) };
}
