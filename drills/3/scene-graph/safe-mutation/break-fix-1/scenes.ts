import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { clearMarked } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 7);
  controls.target.set(0, 0.5, 0);
  const root = new THREE.Group();
  const helpers: THREE.Object3D[] = [];
  for (let i = 0; i < 4; i++) {
    const original = new THREE.MeshStandardMaterial({ color: COLORS.blue });
    const target = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
    target.position.set((i - 1.5) * 1.1, 0.55, 0);
    target.userData.originalMaterial = original;
    root.add(target);
    const helper = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 8, 24), new THREE.MeshBasicMaterial({ color: COLORS.red }));
    helper.position.set(target.position.x, 0.55, 0.42);
    helper.userData.highlightHelper = true;
    helper.userData.target = target;
    helpers.push(helper);
  }
  root.add(...helpers);
  scene.add(root);
  const got = attempt('clearMarked', () => clearMarked(root));
  const left = helpers.filter((helper) => helper.parent === root).length;
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `yellow: still highlighted | red ring: helper remains\nyour cleared count: ${got.value} / 4\nhelpers left: ${left}`
    : got.note;
};
