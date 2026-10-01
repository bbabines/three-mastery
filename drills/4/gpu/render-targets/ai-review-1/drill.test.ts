import { PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import { describe, expect, it } from 'vitest';
import { renderThumbnail } from './drill';
describe('renderThumbnail', () => {
  it('restores the former target after a thumbnail or an error', () => {
    const previous = new WebGLRenderTarget(8, 8); const target = new WebGLRenderTarget(8, 8);
    const scene = new Scene(); const camera = new PerspectiveCamera();
    for (const throws of [false, true]) {
      let current: WebGLRenderTarget | null = previous;
      const draws: (WebGLRenderTarget | null)[] = [];
      const renderer = {
        getRenderTarget: () => current,
        setRenderTarget: (next: WebGLRenderTarget | null) => { current = next; },
        render: () => { draws.push(current); if (throws) throw new Error('lost context'); },
      };
      if (throws) expect(() => renderThumbnail(renderer, target, scene, camera)).toThrow('lost context');
      else renderThumbnail(renderer, target, scene, camera);
      expect(draws).toEqual([target]); expect(current).toBe(previous);
    }
  });
});
