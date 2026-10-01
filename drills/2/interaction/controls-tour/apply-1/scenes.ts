import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { needsControlsUpdate, dollyChanges } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  const product = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  product.position.y = 0.5;
  scene.add(marker, product);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  let damping = true;
  let orthographic = false;
  let shouldUpdate = false;
  const show = () => {
    const update = attempt('needsControlsUpdate', () => needsControlsUpdate(damping, false));
    const activeCamera = orthographic ? new THREE.OrthographicCamera() : new THREE.PerspectiveCamera();
    const dolly = attempt('dollyChanges', () => dollyChanges(activeCamera));
    shouldUpdate = update.ok && update.value;
    readout.textContent = [
      update.ok ? `pointer idle, damping ${damping}: update ${update.value}` : update.note,
      dolly.ok ? `${orthographic ? 'orthographic' : 'perspective'} dolly changes ${dolly.value}` : dolly.note,
      'yellow camera marker keeps moving only when an update is needed',
    ].join('\n');
  };
  for (const [label, action] of [
    ['toggle damping', () => { damping = !damping; }],
    ['toggle camera', () => { orthographic = !orthographic; }],
  ] as const) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => { action(); show(); });
    bar.append(button);
  }
  show();
  onFrame((_, elapsed) => { if (shouldUpdate) marker.position.set(Math.cos(elapsed) * 1.5, 1, Math.sin(elapsed) * 1.5); });
};
