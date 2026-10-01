import type { Answer } from '@harness/drill';
import { Object3D, PerspectiveCamera, Raycaster, Vector3, MathUtils } from 'three';

export interface LabelState { x: number; y: number; worldHeight: number; visible: boolean }
export function labelState(point: Vector3, camera: PerspectiveCamera, width: number, height: number, pixelsTall: number, blockers: Object3D[]): Answer<LabelState> {
  camera.updateMatrixWorld(true);
  for (const blocker of blockers) blocker.updateWorldMatrix(true, true);
  const view = point.clone().applyMatrix4(camera.matrixWorldInverse);
  const ndc = point.clone().project(camera);
  const x = (ndc.x + 1) * width / 2;
  const y = (1 - ndc.y) * height / 2;
  const worldHeight = 2 * -view.z * Math.tan(MathUtils.degToRad(camera.fov) / 2) * pixelsTall / height;
  const eye = camera.getWorldPosition(new Vector3());
  const fromCamera = point.clone().sub(eye);
  const ray = new Raycaster(eye, fromCamera.clone().normalize(), 0, fromCamera.length() - 1e-4);
  const blocked = ray.intersectObjects(blockers, true).length > 0;
  return { x, y, worldHeight, visible: view.z < 0 && ndc.z >= -1 && ndc.z <= 1 && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && !blocked };
}
