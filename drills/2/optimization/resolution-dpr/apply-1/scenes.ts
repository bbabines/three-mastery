import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { ratioWhileOrbiting } from './drill';

export const orbitBudget: SceneSetup = ({ scene, renderer, container, camera, controls, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.22, 160, 24), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  mesh.position.y = 1;
  scene.add(mesh);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const moving = document.createElement('input');
  moving.type = 'checkbox';
  const label = document.createElement('label');
  label.textContent = 'orbiting ';
  label.append(moving);
  bar.append(label);
  onFrame(() => {
    const result = attempt('ratioWhileOrbiting', () => ratioWhileOrbiting(2.5, moving.checked, 2));
    if (!result.ok) { readout.textContent = result.note; return; }
    if (renderer.getPixelRatio() !== result.value) renderer.setPixelRatio(result.value);
    const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
    readout.textContent = `orbiting ${moving.checked ? 'yes' : 'no'}\nDPR ${result.value}\n${(buffer.x * buffer.y).toLocaleString()} device pixels`;
  });
};
