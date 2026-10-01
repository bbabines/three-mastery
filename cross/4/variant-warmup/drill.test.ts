import { answered } from '@harness/check';
import { Mesh, MeshBasicMaterial, Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { warmVariants } from './drill';

describe('variant warm-up', () => {
  it('renders every variant and restores the original', () => {
    const original = new MeshBasicMaterial();
    const mesh = new Mesh(undefined,original);
    const variants = [new MeshBasicMaterial(),new MeshBasicMaterial(),new MeshBasicMaterial()];
    const seen: unknown[] = [];
    const renderer = {render: vi.fn(() => seen.push(mesh.material))} as unknown as WebGLRenderer;
    const scene = new Scene(), camera = new PerspectiveCamera();
    expect(answered(warmVariants(renderer,scene,camera,mesh,variants))).toBe(3);
    expect(seen).toEqual(variants);
    expect(mesh.material).toBe(original);
  });
  it('restores the original even if rendering fails', () => {
    const original = new MeshBasicMaterial();
    const mesh = new Mesh(undefined,original);
    const renderer = {render: () => { throw new Error('context lost'); }} as unknown as WebGLRenderer;
    expect(() => warmVariants(renderer,new Scene(),new PerspectiveCamera(),mesh,[new MeshBasicMaterial()])).toThrow('context lost');
    expect(mesh.material).toBe(original);
  });
});
