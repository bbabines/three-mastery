import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { preuploadTexture } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const texture = new THREE.Texture(); const fakeRenderer = { initTexture: (_texture: THREE.Texture) => {} } as Pick<THREE.WebGLRenderer, "initTexture">;
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('preuploadTexture', () => preuploadTexture(fakeRenderer, texture));
    readout.textContent = result.ok ? `texture queued for upload: ${result.value === texture}` : result.note;
  });
};
