import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { postFragments } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 1.5, 0);
  const marker = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.55), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  marker.position.set(0, 0.15, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  let width = 640, height = 360, passes = 1;
  const show = () => {
    const result = attempt('postFragments', () => postFragments(width,height,passes));
    if (result.ok) { marker.scale.y = result.value / (640 * 360); marker.position.y = 0.15 * marker.scale.y; }
    readout.textContent = result.ok
      ? `${width} × ${height}; ${passes} full-screen ${passes === 1 ? 'pass' : 'passes'}\n${result.value} fragment candidates\nyellow height shows work relative to one 640 × 360 pass`
      : result.note;
  };
  for (const [label, action] of [
    ['double resolution', () => { width = width === 640 ? 1280 : 640; height = height === 360 ? 720 : 360; }],
    ['add pass', () => { passes = passes === 1 ? 3 : 1; }],
  ] as const) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => { action(); show(); });
    bar.append(button);
  }
  show();
};
