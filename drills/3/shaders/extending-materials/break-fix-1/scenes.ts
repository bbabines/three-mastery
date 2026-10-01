import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { addPulse } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.6, 0);
  const pixels = new Uint8Array(4 * 4 * 4);
  for (let i = 0; i < 16; i++) pixels.set([i % 2 ? 90 : 165, 128, 245, 255], i * 4);
  const normal = new THREE.DataTexture(pixels, 4, 4, THREE.RGBAFormat);
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(12, 8);
  normal.needsUpdate = true;
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#172941'; ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#f5faff'; ctx.fillRect(40, 15, 48, 100);
  ctx.fillStyle = '#f5faff'; ctx.fillRect(175, 25, 20, 70);
  const environment = new THREE.CanvasTexture(canvas);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace;
  scene.environment = environment;
  const base = new THREE.MeshStandardMaterial({ color: '#507090', roughness: 0.4, metalness: 0.3, normalMap: normal });
  const mesh = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(0.65, 48, 32), base);
  mesh.position.y = 0.65;
  scene.add(mesh);
  const result = attempt('addPulse', () => addPulse(base, 0.3));
  if (result.ok) mesh.material = result.value;
  overlay(container, 'readout').textContent = result.ok
    ? `Pulse material: ${result.value.type}\nOriginal material retained: ${result.value === base}\nLook for studio reflections and small normal-map ripples.`
    : result.note;
};
