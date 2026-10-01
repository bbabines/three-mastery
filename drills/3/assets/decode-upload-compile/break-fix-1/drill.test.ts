import { PerspectiveCamera, Scene, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { prepareVariant, type WarmupRenderer } from './drill';

describe('prepareVariant', () => {
  it('waits for shader compilation and uploads the texture', async () => {
    const calls: string[] = [];
    let release!: () => void;
    const compile = new Promise<void>((resolve) => { release = resolve; });
    const renderer: WarmupRenderer = {
      compileAsync: async () => { calls.push('compile'); await compile; calls.push('compiled'); },
      initTexture: () => { calls.push('texture'); },
    };
    const pending = prepareVariant(renderer, new Scene(), new PerspectiveCamera(), new Texture());
    expect(calls).toEqual(['compile']);
    release();
    await pending;
    expect(calls).toEqual(['compile', 'compiled', 'texture']);
  });
});
