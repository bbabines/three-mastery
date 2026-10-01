import { attempt, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { prepareGlass } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(0, 1, 5);
  controls.target.set(0, 0.5, 0);
  const glass = new THREE.MeshBasicMaterial({ color: COLORS.yellow });
  const result = attempt('prepareGlass', () => prepareGlass(glass, 0.4));
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glass);
  pane.position.set(0, 0.8, 0.2);
  pane.renderOrder = 1;
  const behind = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.95 }));
  behind.position.set(0, 0.8, -0.2);
  behind.renderOrder = 2; // Show why a depth-writing glass pane can hide later transparent work.
  scene.add(pane, behind);
  const readout = overlay(container, 'readout');
  readout.textContent = result.ok
    ? `yellow glass draws first; blue part draws second
blue should remain visible through the glass
transparent ${glass.transparent}; depth write ${glass.depthWrite}`
    : result.note;
  frameMeter(harness, readout);
};
