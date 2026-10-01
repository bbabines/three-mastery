import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { preloadLikely } from './drill';

export const preload: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const product = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.blue }));
  product.position.y = 0.6;
  scene.add(product);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  for (const fail of [false, true]) {
    const button = document.createElement('button');
    button.textContent = fail ? 'Try failed next variant' : 'Try ready next variant';
    button.addEventListener('click', async () => {
      const result = attempt('preloadLikely', () => preloadLikely([{ url: 'next', likely: true }, { url: 'later', likely: false }], async (url) => {
        if (fail) throw new Error(`${url} failed`);
        return url;
      }));
      if (!result.ok) { readout.textContent = result.note; return; }
      try { const loaded = await result.value; readout.textContent = `loaded: ${loaded.join(', ')}\nstate: ready`; }
      catch (error) { readout.textContent = `state: failed\n${String(error)}`; }
    });
    bar.append(button);
  }
  readout.textContent = 'Select a preload result.';
};
