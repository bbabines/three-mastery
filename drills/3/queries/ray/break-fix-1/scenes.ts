import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { sphereEntry } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 7);
  controls.target.set(0, 1, 0);
  const sphere = new THREE.Sphere(new THREE.Vector3(0, 1.2, 0), 1);
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: COLORS.blue, wireframe: true })).translateY(1.2));
  const ray = new THREE.Ray(new THREE.Vector3(0, 1.2, 4), new THREE.Vector3(0, 0, -1));
  const path = line(COLORS.white);
  setLine(path, ray.origin, ray.at(6, new THREE.Vector3()));
  scene.add(path);
  const expected = ray.intersectSphere(sphere, new THREE.Vector3());
  const got = attempt('sphereEntry', () => sphereEntry(ray, sphere));
  if (expected) { const mark = ball(COLORS.yellow); mark.position.copy(expected); scene.add(mark); }
  if (got.ok && got.value) { const mark = ball(COLORS.red); mark.position.copy(got.value); scene.add(mark); }
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `white: ray | blue: sphere\nyellow: surface entry | red: your point\npoints apart: ${got.value && expected ? got.value.distanceTo(expected).toFixed(2) : 'no hit'}`
    : got.note;
};
