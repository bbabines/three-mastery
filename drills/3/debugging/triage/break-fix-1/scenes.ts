import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { firstBlocker } from './drill';

export const triage: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3, 5);
  controls.target.set(0, 0.5, 0);
  const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0x000000 }));
  mesh.position.y = 0.6;
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  for (const [label, apply] of [
    ['detach', () => scene.remove(mesh)],
    ['move outside view', () => { scene.add(mesh); mesh.position.x = 100; }],
    ['show black material', () => { scene.add(mesh); mesh.position.x = 0; }],
  ] as const) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', apply);
    bar.append(button);
  }
  onFrame(() => {
    const result = attempt('firstBlocker', () => firstBlocker(scene, camera, mesh));
    readout.textContent = result.ok ? `first blocker: ${result.value}` : result.note;
  });
  scene.add(mesh);
};
