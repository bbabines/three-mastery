import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { uvAtHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 7);
  controls.target.set(1, 1, 0);
  const a = new THREE.Vector3(0, 0.5, 0), b = new THREE.Vector3(2, 0.5, 0), c = new THREE.Vector3(0, 2.5, 0);
  const geometry = new THREE.BufferGeometry().setFromPoints([a, b, c]);
  geometry.setIndex([0, 1, 2]);
  scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.blue, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })));
  const ray = new THREE.Ray(new THREE.Vector3(0.5, 1, 2), new THREE.Vector3(0, 0, -1));
  const path = line(COLORS.white);
  setLine(path, ray.origin, ray.at(3, new THREE.Vector3()));
  scene.add(path);
  const hit = ball(COLORS.white);
  hit.position.set(0.5, 1, 0);
  scene.add(hit);
  const uva = new THREE.Vector2(0, 0), uvb = new THREE.Vector2(1, 0), uvc = new THREE.Vector2(0, 1);
  const got = attempt('uvAtHit', () => uvAtHit(ray, a, b, c, uva, uvb, uvc));
  const uvOrigin = new THREE.Vector3(2.8, 0.5, 0);
  const uvCorners = [uvOrigin, uvOrigin.clone().add(new THREE.Vector3(2, 0, 0)), uvOrigin.clone().add(new THREE.Vector3(0, 2, 0))];
  for (let i = 0; i < 3; i++) {
    const edge = line(COLORS.green);
    setLine(edge, uvCorners[i], uvCorners[(i + 1) % 3]);
    scene.add(edge);
  }
  const expected = new THREE.Vector2(0.25, 0.25);
  const yellow = ball(COLORS.yellow);
  yellow.position.set(uvOrigin.x + expected.x * 2, uvOrigin.y + expected.y * 2, 0);
  scene.add(yellow);
  if (got.ok && got.value) {
    const red = ball(COLORS.red);
    red.position.set(uvOrigin.x + got.value.x * 2, uvOrigin.y + got.value.y * 2, 0);
    scene.add(red);
  }
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `left: triangle hit | right: UV position\nyellow: interpolated UV | red: your UV\nyours: ${got.value ? got.value.toArray().map((n) => n.toFixed(2)).join(', ') : 'no hit'}`
    : got.note;
};
