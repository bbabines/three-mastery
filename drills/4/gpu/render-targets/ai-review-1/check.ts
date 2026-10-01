import type { Camera, Scene, WebGLRenderTarget } from 'three';

type Renderer = { getRenderTarget(): WebGLRenderTarget | null; setRenderTarget(target: WebGLRenderTarget | null): void; render(scene: Scene, camera: Camera): void };
type Thumbnail = (renderer: Renderer, target: WebGLRenderTarget, scene: Scene, camera: Camera) => void;

export function checkTargetRestore(_renderThumbnail: Thumbnail): void {
  throw new Error('Write the regression check in check.ts');
}
