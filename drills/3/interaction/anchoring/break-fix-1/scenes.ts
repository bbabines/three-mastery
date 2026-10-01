import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { labelState } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 0, 0);
  const probe = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
  probe.position.set(-1, 0.5, 1);
  probe.lookAt(-1, 0.5, -2);
  scene.add(probe);
  const front = ball(COLORS.yellow, 1, 0.18);
  const behind = ball(COLORS.blue, 1, 0.18);
  front.position.set(-1, 0.5, -2);
  behind.position.set(-1, 0.5, 3);
  scene.add(front, behind);
  const tag = overlay(container, 'controls');
  const readout = overlay(container, 'readout');
  onFrame(() => {
    const result = attempt('labelState', () => labelState(probe, behind.position.clone(), 400, 400));
    if (!result.ok) { tag.textContent = ''; readout.textContent = result.note; return; }
    tag.textContent = result.value.visible ? 'WRONG: rear price tag is visible' : 'Rear price tag hidden';
    readout.textContent = `yellow: in front of the label camera; blue: behind it
your rear label: ${result.value.visible ? 'visible' : 'hidden'}; reference: hidden`;
  });
};
