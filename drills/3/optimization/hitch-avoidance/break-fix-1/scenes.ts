import { overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, DataTexture, Mesh, MeshBasicMaterial, RGBAFormat, Scene } from 'three';
import { revealVariant } from './drill';

export const variantReveal: SceneSetup = ({ scene, renderer, camera, controls, container }) => {
  camera.position.set(2, 2, 4);
  controls.target.set(0, 0, 0);
  const geometry = new BoxGeometry();
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  readout.textContent = 'switch to reveal the variant';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'switch variant';
  bar.append(button);

  button.onclick = async () => {
    button.disabled = true;
    const events: string[] = [];
    const texture = new DataTexture(new Uint8Array([80, 210, 255, 255]), 1, 1, RGBAFormat);
    texture.needsUpdate = true;
    const material = new MeshBasicMaterial({ map: texture });
    const variant = new Mesh(geometry, material);
    const prepScene = new Scene();
    prepScene.add(variant);
    const warmRenderer = {
      initTexture: () => {
        events.push('upload');
        renderer.initTexture(texture);
        readout.textContent = events.join(' → ');
      },
      compileAsync: async () => {
        events.push('compile');
        readout.textContent = events.join(' → ');
        await renderer.compileAsync(prepScene, camera);
      },
    };
    try {
      await revealVariant(warmRenderer, prepScene, camera, texture, () => {
        events.push('show');
        prepScene.remove(variant);
        scene.add(variant);
        readout.textContent = events.join(' → ');
      });
    } catch (error) {
      readout.textContent = String(error);
      material.dispose();
      texture.dispose();
    } finally {
      button.disabled = false;
    }
  };
};
