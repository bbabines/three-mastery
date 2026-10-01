import { answered } from '@harness/check';
import { DataTexture, Mesh, NearestFilter, NoColorSpace, OrthographicCamera, PlaneGeometry, RGBAFormat, Scene, UnsignedByteType, WebGLRenderTarget, WebGLRenderer } from 'three';
import { describe, expect, it } from 'vitest';
import { roughnessDebug } from './drill';

describe('packed roughness debug view', () => {
  it('draws the raw green channel rather than a color-converted channel', () => {
    const texture = new DataTexture(new Uint8Array([20,153,240,255]),1,1,RGBAFormat,UnsignedByteType);
    texture.minFilter = texture.magFilter = NearestFilter;
    texture.needsUpdate = true;
    const material = answered(roughnessDebug(texture));
    expect(texture.colorSpace).toBe(NoColorSpace);
    const renderer = new WebGLRenderer({antialias:false});
    const target = new WebGLRenderTarget(1,1);
    const scene = new Scene();
    scene.add(new Mesh(new PlaneGeometry(2,2),material));
    const camera = new OrthographicCamera(-1,1,1,-1,0.1,10);
    camera.position.z = 2;
    renderer.setRenderTarget(target);
    renderer.render(scene,camera);
    const pixel = new Uint8Array(4);
    renderer.readRenderTargetPixels(target,0,0,1,1,pixel);
    expect(pixel[0]).toBeGreaterThan(148);
    expect(pixel[0]).toBeLessThan(158);
    expect(pixel[1]).toBe(pixel[0]);
    renderer.dispose();
    target.dispose();
    material.dispose();
    texture.dispose();
  });
});
