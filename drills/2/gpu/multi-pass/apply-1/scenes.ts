import { attempt, COLORS, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { outputLast } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const readout = overlay(container, 'readout');
  const passes = ["render","output","bloom"];
  {
    const result = attempt('outputLast', () => outputLast(passes));
    if (result.ok) result.value.forEach((pass, index) => {
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.2), new THREE.MeshStandardMaterial({ color: pass === 'output' ? COLORS.yellow : COLORS.blue }));
      block.position.set((index - (result.value.length - 1) / 2) * 1.1, 0.9, 0);
      const caption = label(pass, COLORS.white);
      caption.position.copy(block.position).add(new THREE.Vector3(0, 0.65, 0));
      scene.add(block, caption);
    });
    readout.textContent = result.ok ? `your chain: ${result.value.join(' → ')}\noutput belongs once, at the end` : result.note;
  }
};
