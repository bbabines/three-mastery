import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { canAppear } from './drill';

export const vanishing: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const parent = new Group();
  const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.orange }));
  mesh.position.y = 0.6;
  parent.add(mesh); scene.add(parent);
  const bar = overlay(container, 'controls');
  const readout = overlay(container, 'readout');
  const button = document.createElement('button');
  button.textContent = 'Toggle zero scale';
  button.addEventListener('click', () => { parent.scale.x = parent.scale.x === 0 ? 1 : 0; });
  bar.append(button);
  onFrame(() => {
    const result = attempt('canAppear', () => canAppear(mesh));
    readout.textContent = result.ok ? `parent scale.x: ${parent.scale.x}\npart visible? ${parent.scale.x !== 0}\nyour diagnosis: ${result.value}` : result.note;
  });
};
