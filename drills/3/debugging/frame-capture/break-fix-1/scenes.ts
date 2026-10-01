import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { drawCount } from './drill';

export const capture: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.purple }));
  mesh.position.y = 0.6;
  scene.add(mesh);
  const trace = [
    { op: 'bindFramebuffer' }, { op: 'drawElements', count: 36 },
    { op: 'bindFramebuffer' }, { op: 'drawElementsInstanced', count: 36 },
  ];
  const result = attempt('drawCount', () => drawCount(trace));
  overlay(container, 'readout').textContent = result.ok
    ? `scene meshes: 1\ncaptured draws: 2\nyour count: ${result.value}`
    : result.note;
};
