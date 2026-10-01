import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pickPixel } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  camera.position.set(2, 2, 5);
  controls.target.set(0, 0.5, 0);
  const idScene = new THREE.Scene();
  idScene.background = new THREE.Color(0xff0000);
  const target = new THREE.WebGLRenderTarget(8, 8);
  renderer.setRenderTarget(target);
  renderer.render(idScene, camera);
  renderer.setRenderTarget(null);
  const color = ball(COLORS.yellow, 1, 0.5);
  color.position.y = 0.8;
  scene.add(color);
  const readout = overlay(container, 'readout');
  let sync = 0;
  let asyncReads = 0;
  const adapter = {
    readRenderTargetPixels: (t: THREE.WebGLRenderTarget, x: number, y: number, w: number, h: number, data: Uint8Array) => {
      sync++;
      renderer.readRenderTargetPixels(t, x, y, w, h, data);
    },
    readRenderTargetPixelsAsync: async (t: THREE.WebGLRenderTarget, x: number, y: number, w: number, h: number, data: Uint8Array) => {
      asyncReads++;
      return new Uint8Array(await renderer.readRenderTargetPixelsAsync(t, x, y, w, h, data) as Uint8Array);
    },
  };
  const result = attempt('pickPixel', () => pickPixel(adapter, target, 3, 4));
  readout.dataset.base = result.ok ? 'Reading a red ID pixel…' : result.note;
  if (result.ok) void result.value.then(pixel => {
    (color.material as THREE.MeshStandardMaterial).color.setRGB(pixel[0] / 255, pixel[1] / 255, pixel[2] / 255);
    readout.dataset.base = `ID color on the ball: ${Array.from(pixel).join(', ')}\nsync reads: ${sync}; async reads: ${asyncReads}`;
  });
  frameMeter(harness, readout);
};
