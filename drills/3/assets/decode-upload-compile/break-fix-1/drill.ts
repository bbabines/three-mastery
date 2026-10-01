// Variant warmup: find the GPU work still left for the first visible frame.
import type { Camera, Scene, Texture } from 'three';

export type WarmupRenderer = {
  compileAsync(scene: Scene, camera: Camera): Promise<unknown>;
  initTexture(texture: Texture): void;
};

export async function prepareVariant(renderer: WarmupRenderer, scene: Scene, camera: Camera, texture: Texture): Promise<void> {
  await renderer.compileAsync(scene, camera);
}
