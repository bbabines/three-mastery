import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it } from 'vitest';
import { readIdPixel } from './drill';

it('reads a rendered ID color asynchronously from one target pixel', async () => {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(8, 8);
  const target = new THREE.WebGLRenderTarget(8, 8);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff0000);
  const camera = new THREE.PerspectiveCamera();
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  const pixel = await answered(readIdPixel(renderer, target, 4, 4)) as Uint8Array;
  expect(pixel[0]).toBeGreaterThan(200);
  expect(pixel[1]).toBeLessThan(20);
  expect(pixel[2]).toBeLessThan(20);
  target.dispose();
  renderer.dispose();
});
