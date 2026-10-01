import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { cpuRenderMs } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const testScene = new THREE.Scene(); testScene.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial()));
  {
    const result = attempt('cpuRenderMs', () => cpuRenderMs(renderer,testScene,camera,performance.now.bind(performance)));
    readout.textContent = result.ok ? `CPU submission: ${result.value.toFixed(2)} ms (GPU time needs another tool)` : result.note;
  }
};
