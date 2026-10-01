import type { Camera, Scene, Texture } from 'three';
import type { WarmupRenderer } from './drill';

type Prepare = (renderer: WarmupRenderer, scene: Scene, camera: Camera, texture: Texture) => Promise<void>;

export async function checkWarmup(_prepare: Prepare): Promise<void> {
  throw new Error('Write the regression check in check.ts');
}
