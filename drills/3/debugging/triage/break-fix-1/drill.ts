// Black-screen triage: identify the misplaced first check.
import { Frustum, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene } from 'three';

export type Blocker = 'scene' | 'camera' | 'material' | 'none';

export function firstBlocker(scene: Scene, camera: PerspectiveCamera, mesh: Mesh): Blocker {
  if (mesh.material instanceof MeshBasicMaterial && mesh.material.color.getHex() === 0) return 'material';
  if (!scene.getObjectById(mesh.id)) return 'scene';
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
  if (!frustum.intersectsObject(mesh)) return 'camera';
  return 'none';
}
