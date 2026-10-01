import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { chromeStage } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.55, 0);
  const chrome = new THREE.MeshStandardMaterial({ color: '#ffffff' });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.65, 48, 32), chrome);
  sphere.position.y = 0.65;
  scene.add(sphere);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#101b35';
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#e5f4ff';
  ctx.fillRect(80, 28, 90, 170);
  ctx.fillStyle = '#ffcf85';
  ctx.fillRect(350, 45, 50, 145);
  const lighting = new THREE.CanvasTexture(canvas);
  lighting.mapping = THREE.EquirectangularReflectionMapping;
  lighting.colorSpace = THREE.SRGBColorSpace;
  const backdrop = new THREE.Color('#314765');
  const backCanvas = document.createElement('canvas');
  backCanvas.width = 2; backCanvas.height = 2;
  backCanvas.getContext('2d')!.fillStyle = backdrop.getStyle();
  backCanvas.getContext('2d')!.fillRect(0, 0, 2, 2);
  const back = new THREE.CanvasTexture(backCanvas);
  back.mapping = THREE.EquirectangularReflectionMapping;
  back.colorSpace = THREE.SRGBColorSpace;

  const result = attempt('chromeStage', () => chromeStage(scene, chrome, lighting, back));
  overlay(container, 'readout').textContent = result.ok
    ? `Backdrop: ${scene.background === back ? 'visible' : 'missing'}\nChrome reflections: ${scene.environment === lighting ? 'connected' : 'missing'}\nLook for bright studio panels in the metal.`
    : result.note;
};
