import { COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { captureThumbnail } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  camera.position.set(2, 2, 5);
  controls.target.set(0, 0.5, 0);
  const product = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  product.position.y = 0.5;
  scene.add(product);
  const target = new THREE.WebGLRenderTarget(128, 128);
  const thumbnail = new THREE.Scene();
  thumbnail.background = new THREE.Color(COLORS.yellow);
  const readout = overlay(container, 'readout');
  let error: unknown;
  try { captureThumbnail(renderer, thumbnail, camera, target); }
  catch (cause) { error = cause; }
  readout.textContent = error
    ? `captureThumbnail threw: ${String(error)}`
    : `blue product should remain on the main canvas
thumbnail target bound afterward: ${renderer.getRenderTarget() === target ? 'yes — canvas stays blank' : 'no — canvas resumes'}`;
  frameMeter(harness, readout);
};
