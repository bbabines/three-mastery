import type { Camera, Scene, WebGLRenderTarget } from 'three';
type Renderer = { getRenderTarget(): WebGLRenderTarget | null; setRenderTarget(target: WebGLRenderTarget | null): void; render(scene: Scene, camera: Camera): void };
export function renderThumbnail(renderer: Renderer, target: WebGLRenderTarget, scene: Scene, camera: Camera): void {
  const previous = renderer.getRenderTarget();
  try { renderer.setRenderTarget(target); renderer.render(scene, camera); }
  finally { renderer.setRenderTarget(previous); }
}
