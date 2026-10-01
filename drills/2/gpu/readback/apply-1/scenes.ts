import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { readIdPixel } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const target = new THREE.WebGLRenderTarget(8,8);
  const ids = new THREE.Scene(); ids.background = new THREE.Color(0xff0000);
  renderer.setRenderTarget(target); renderer.render(ids,camera); renderer.setRenderTarget(null);
  {
    const result = attempt('readIdPixel', () => readIdPixel(renderer,target,3,4));
    readout.textContent = result.ok ? 'Reading the red ID pixel asynchronously…' : result.note;
    if (result.ok) void result.value.then(data => { const pixel = new Uint8Array(data.buffer,data.byteOffset,data.byteLength); (marker.material as THREE.MeshStandardMaterial).color.setRGB(pixel[0]/255,pixel[1]/255,pixel[2]/255); readout.textContent = `ID pixel: ${Array.from(pixel).join(', ')}\nmarker should match the red ID target`; });
  }
};
