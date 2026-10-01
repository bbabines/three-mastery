import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh } from 'three';
import { explainShaderError } from './drill';

export const shaderLog: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const result = attempt('explainShaderError', () => explainShaderError("ERROR: 0:74: 'foo' : undeclared identifier", 50));
  if (!result.ok) { overlay(container, 'readout').textContent = result.note; return; }
  const mesh = new Mesh(new BoxGeometry(), result.value.debugMaterial);
  mesh.position.y = 0.6;
  scene.add(mesh);
  overlay(container, 'readout').textContent = `compiler line: 74\nuser edit line: 24\nyour highlighted line: ${result.value.sourceLine}`;
};
