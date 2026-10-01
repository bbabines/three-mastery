import { attempt, ball, COLORS, label, overlay, showCamera } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { labelVisible } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(7, 4, 12);
  controls.target.set(0, 1, 5);
  const eye = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
  eye.position.set(0, 1, 5);
  eye.lookAt(0, 1, 0);
  scene.add(eye, showCamera(eye));
  const readout = overlay(container, 'readout');
  const front = new THREE.Vector3(0, 1, 0);
  const behind = new THREE.Vector3(0, 1, 10);
  const frontMarker = ball(COLORS.green, 1, 0.25);
  const behindMarker = ball(COLORS.red, 1, 0.25);
  frontMarker.position.copy(front);
  behindMarker.position.copy(behind);
  scene.add(frontMarker, behindMarker);

  const frontResult = attempt('labelVisible front', () => labelVisible(eye, front.clone()));
  const behindResult = attempt('labelVisible behind', () => labelVisible(eye, behind.clone()));
  if (!frontResult.ok) { readout.textContent = frontResult.note; return; }
  if (!behindResult.ok) { readout.textContent = behindResult.note; return; }
  if (frontResult.value) {
    const tag = label('front label', COLORS.green);
    tag.position.copy(front).add(new THREE.Vector3(0, 0.55, 0));
    scene.add(tag);
  }
  if (behindResult.value) {
    const tag = label('behind label', COLORS.red);
    tag.position.copy(behind).add(new THREE.Vector3(0, 0.55, 0));
    scene.add(tag);
  }
  readout.textContent = `green: in front · red: behind the lens\nyour labels: front ${frontResult.value}, behind ${behindResult.value} (goal: true, false)`;
};
