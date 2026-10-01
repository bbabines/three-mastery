import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Texture } from 'three';
import { retireProduct } from './drill';

export const routeCleanup: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.6, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const button = document.createElement('button');
  button.textContent = 'Close product route';
  bar.append(button);
  const product = new Group();
  const geometry = new BoxGeometry(1, 1, 1);
  const texture = new Texture();
  const material = new MeshStandardMaterial({ color: COLORS.orange, map: texture });
  const mesh = new Mesh(geometry, material);
  mesh.position.y = 0.6;
  product.add(mesh); scene.add(product);
  let disposed = 0;
  for (const resource of [geometry, material, texture]) resource.addEventListener('dispose', () => { disposed += 1; });
  button.addEventListener('click', () => {
    const result = attempt('retireProduct', () => retireProduct(product));
    readout.textContent = result.ok ? `product detached: ${product.parent === null}\nresources disposed: ${disposed}/3` : result.note;
  });
  readout.textContent = 'Product route open. Close it to inspect cleanup.';
};
