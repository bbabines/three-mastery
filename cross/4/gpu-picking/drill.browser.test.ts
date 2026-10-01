import { Color, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, NoColorSpace, OrthographicCamera, PlaneGeometry, Scene, WebGLRenderTarget, WebGLRenderer } from 'three';
import { expect, it } from 'vitest';
import { readPickId } from './drill';

it('decodes the ID from a real render target without a synchronous pixel read', async () => {
  const renderer = new WebGLRenderer({ antialias: false });
  renderer.setSize(8, 8);
  const target = new WebGLRenderTarget(8, 8);
  target.texture.colorSpace = NoColorSpace;
  const rgb = [19, 31, 47];
  const color = new Color().setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, LinearSRGBColorSpace);
  const material = new MeshBasicMaterial({ color, toneMapped: false });
  const geometry = new PlaneGeometry(2, 2);
  const scene = new Scene();
  scene.add(new Mesh(geometry, material));
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 2;
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  expect(await readPickId(renderer, target, 4, 4)).toBe(rgb[0] + rgb[1] * 256 + rgb[2] * 65536);

  geometry.dispose();
  material.dispose();
  target.dispose();
  renderer.dispose();
});
