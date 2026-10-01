import { arrow, attempt, COLORS, overlay, setArrow } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pointerRay } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 7);
  controls.target.set(0, 1, 0);
  const pickCamera = new THREE.PerspectiveCamera(60, 1.5, 0.1, 100);
  pickCamera.position.set(0, 1, 5);
  pickCamera.lookAt(0, 1, 0);
  pickCamera.updateMatrixWorld();
  const rect = { left: 100, top: 50, width: 600, height: 400 };
  const got = attempt('pointerRay', () => pointerRay(pickCamera, 400, 250, rect));
  const caster = new THREE.Raycaster();
  caster.setFromCamera(new THREE.Vector2(0, 0), pickCamera);
  const expected = caster.ray;
  const target = new THREE.Mesh(new THREE.SphereGeometry(0.22), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  target.position.set(0, 1, 0);
  scene.add(target);
  const correct = arrow(COLORS.yellow);
  setArrow(correct, expected.origin, expected.direction.clone().multiplyScalar(5));
  scene.add(correct);
  if (got.ok) { const yours = arrow(COLORS.red); setArrow(yours, got.value.origin, got.value.direction.clone().multiplyScalar(5)); scene.add(yours); }
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `canvas center is (400, 250) on the page\nyellow: center ray | red: your ray\nangle apart: ${(expected.direction.angleTo(got.value.direction) * 180 / Math.PI).toFixed(1)}°`
    : got.note;
};
