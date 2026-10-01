import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { nodeNamesForMesh } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const document = { nodes: [{ name: "left", mesh: 0 }, { name: "right", mesh: 0 }] };
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('nodeNamesForMesh', () => nodeNamesForMesh(document, 0));
    readout.textContent = result.ok ? `nodes: ${result.value.join(', ')}` : result.note;
  });
};
