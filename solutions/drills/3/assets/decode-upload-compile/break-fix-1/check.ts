import { expect } from 'vitest';
import { PerspectiveCamera, Scene, Texture } from 'three';
import type { Camera, Scene as SceneType, Texture as TextureType } from 'three';
import type { WarmupRenderer } from './drill';

type Prepare = (renderer: WarmupRenderer, scene: SceneType, camera: Camera, texture: TextureType) => Promise<void>;

export async function checkWarmup(prepare: Prepare): Promise<void> {
  let uploaded = false;
  const renderer: WarmupRenderer = {
    compileAsync: async () => undefined,
    initTexture: () => { uploaded = true; },
  };
  await prepare(renderer, new Scene(), new PerspectiveCamera(), new Texture());
  expect(uploaded, 'a compiled program does not upload the image').toBe(true);
}
