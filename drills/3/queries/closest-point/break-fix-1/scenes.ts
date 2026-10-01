import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { segmentSnap } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 4, 7);
  controls.target.set(0, 1, 0);
  const a = new THREE.Vector3(-1, 0.5, 0), b = new THREE.Vector3(1, 0.5, 0);
  const point = new THREE.Vector3(2, 2, 0);
  const edge = line(COLORS.blue);
  setLine(edge, a, b);
  scene.add(edge);
  const query = ball(COLORS.white), expected = ball(COLORS.yellow);
  query.position.copy(point);
  expected.position.copy(b);
  scene.add(query, expected);
  const got = attempt('segmentSnap', () => segmentSnap(point.clone(), a.clone(), b.clone()));
  if (got.ok) { const yours = ball(COLORS.red); yours.position.copy(got.value); scene.add(yours); }
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `white: query | blue: finite edge\nyellow: nearest endpoint | red: your snap\ndistance between markers: ${got.value.distanceTo(b).toFixed(2)}`
    : got.note;
};
