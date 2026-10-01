import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { withHidden } from './drill';

export const isolatePanel: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const panel = new Mesh(new BoxGeometry(2, 0.08, 1.5), new MeshStandardMaterial({ color: COLORS.yellow }));
  panel.position.y = 0.5;
  scene.add(panel);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const button = document.createElement('button');
  button.textContent = 'Run failed isolation probe';
  button.addEventListener('click', () => {
    panel.visible = true;
    const result = attempt('withHidden', () => withHidden(panel, () => { throw new Error('probe interrupted'); }));
    readout.textContent = `${result.ok ? 'probe returned' : result.note}\npanel restored: ${panel.visible}`;
  });
  bar.append(button);
  readout.textContent = 'Hide the panel for a probe, then put it back.';
};
