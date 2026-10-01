import { CanvasTexture, Mesh, MeshStandardMaterial, SphereGeometry, SRGBColorSpace, Texture } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { prepareChrome } from './drill';

export const chrome: SceneSetup = ({ scene, container }) => {
  const material = new MeshStandardMaterial({color:0xffffff,metalness:0,roughness:0.1});
  const mesh = new Mesh(new SphereGeometry(1,32,24),material);
  mesh.position.y = 1.2;
  scene.add(mesh);
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#35475f'; context.fillRect(0,0,256,128);
  context.fillStyle = '#f4f7ff'; context.fillRect(15,12,70,72);
  context.fillStyle = '#a9c5de'; context.fillRect(150,20,38,65);
  const fallback = new CanvasTexture(canvas);
  fallback.colorSpace = SRGBColorSpace;
  const result = attempt('chrome setup', () => prepareChrome(scene,material,new Texture(),fallback,false));
  const readout = overlay(container,'readout');
  readout.textContent = result.ok ? `Environment choice: ${result.value}. The bright panels should reflect on the sphere.` : result.note;
};
