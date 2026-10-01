import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { boundsInWorld } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7);
  controls.target.set(1, 1, 0);
  const parent = new THREE.Group();
  parent.position.set(1.5, 0.8, 0);
  parent.rotation.y = 0.7;
  const part = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  part.position.y = 0.7;
  parent.add(part);
  scene.add(parent);
  parent.updateWorldMatrix(true, true);
  const expected = new THREE.Box3().setFromObject(part, true);
  scene.add(new THREE.Box3Helper(expected, COLORS.yellow));
  const got = attempt('boundsInWorld', () => boundsInWorld(part));
  if (got.ok) scene.add(new THREE.Box3Helper(got.value, COLORS.red));
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `yellow: world bounds | red: your bounds\nmin corners apart: ${got.value.min.distanceTo(expected.min).toFixed(2)}\nmax corners apart: ${got.value.max.distanceTo(expected.max).toFixed(2)}`
    : got.note;
};
