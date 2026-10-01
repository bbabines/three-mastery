import { attempt, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { candidateLeaves } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(7, 5, 9);
  controls.target.set(0, 0.5, 0);
  const root = new THREE.Group();
  root.userData.box = new THREE.Box3(new THREE.Vector3(-5, 0, -4), new THREE.Vector3(5, 2, 2));
  const near = new THREE.Object3D(), missed = new THREE.Object3D();
  near.name = 'ray crosses';
  missed.name = 'ray misses';
  near.userData.box = new THREE.Box3(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 2, 1));
  missed.userData.box = new THREE.Box3(new THREE.Vector3(3, 0, -4), new THREE.Vector3(5, 2, -2));
  root.add(near, missed);
  const ray = new THREE.Ray(new THREE.Vector3(0, 1, 5), new THREE.Vector3(0, 0, -1));
  const path = line(COLORS.yellow);
  setLine(path, ray.origin, ray.at(10, new THREE.Vector3()));
  scene.add(path);
  const got = attempt('candidateLeaves', () => candidateLeaves(ray, root));
  for (const leaf of [near, missed]) {
    const chosen = got.ok && got.value.includes(leaf);
    scene.add(new THREE.Box3Helper(leaf.userData.box as THREE.Box3, chosen ? COLORS.red : COLORS.blue));
  }
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `yellow ray crosses one box\nred: your candidates | blue: excluded\nyour count: ${got.value.length} | expected: 1`
    : got.note;
};
