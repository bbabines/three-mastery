import type { Answer } from '@harness/drill';
import { Scene, Texture } from 'three';
export function setStudioEnvironment(scene: Scene, lighting: Texture, backdrop: Texture): Answer<Scene> {
  scene.environment = lighting;
  scene.background = backdrop;
  return scene;
}
