import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Texture } from 'three';
import { prepareVariant, type WarmupRenderer } from './drill';

export const variantWarmup: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const part = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.blue }));
  part.position.y = 0.6;
  scene.add(part);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const button = document.createElement('button');
  button.textContent = 'Prepare next variant';
  bar.append(button);
  button.addEventListener('click', async () => {
    const work: string[] = [];
    const fake: WarmupRenderer = {
      compileAsync: async () => { work.push('shader'); },
      initTexture: () => { work.push('texture'); },
    };
    const result = attempt('prepareVariant', () => prepareVariant(fake, new Scene(), new PerspectiveCamera(), new Texture()));
    if (!result.ok) { readout.textContent = result.note; return; }
    await result.value;
    readout.textContent = `shader ready: ${work.includes('shader')}\ntexture ready: ${work.includes('texture')}\n${work.includes('texture') ? 'switch can avoid first-use upload' : 'texture upload remains'}`;
  });
  readout.textContent = 'Prepare the next variant before switching to it.';
};
