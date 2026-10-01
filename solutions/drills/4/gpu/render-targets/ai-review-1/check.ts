import { expect } from 'vitest';
import { PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';

type Renderer = { getRenderTarget(): WebGLRenderTarget | null; setRenderTarget(target: WebGLRenderTarget | null): void; render(scene: Scene, camera: Camera): void };
type Thumbnail = (renderer: Renderer, target: WebGLRenderTarget, scene: Scene, camera: Camera) => void;

export function checkTargetRestore(renderThumbnail: Thumbnail): void {
  const previous = new WebGLRenderTarget(4, 4);
  const target = new WebGLRenderTarget(4, 4);
  let current: WebGLRenderTarget | null = previous;
  const renderer: Renderer = {
    getRenderTarget: () => current,
    setRenderTarget: (next) => { current = next; },
    render: () => undefined,
  };
  renderThumbnail(renderer, target, new Scene(), new PerspectiveCamera());
  expect(current, 'a later render must use the former target').toBe(previous);
}
