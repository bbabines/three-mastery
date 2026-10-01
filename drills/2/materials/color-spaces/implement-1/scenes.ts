import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { setTextureSpaces } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.8, 3);
  controls.target.set(0, 0.5, 0);
  const canvas = document.createElement('canvas');
  canvas.width = 2; canvas.height = 2;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#c77a36'; ctx.fillRect(0, 0, 2, 2);
  const albedo = new THREE.CanvasTexture(canvas);
  const normal = new THREE.Texture(), roughness = new THREE.Texture();
  const material = new THREE.MeshStandardMaterial({ color: COLORS.white, map: albedo });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 24), material);
  sphere.position.y = 0.6;
  scene.add(sphere);
  const readout = overlay(container, 'readout');
  const result = attempt('setTextureSpaces', () => setTextureSpaces(albedo, normal, roughness));
  readout.textContent = result.ok
    ? `color map: ${result.value.albedo.colorSpace || 'none'}\nnormal map: ${result.value.normal.colorSpace || 'none'}\nroughness map: ${result.value.roughness.colorSpace || 'none'}`
    : result.note;
};
