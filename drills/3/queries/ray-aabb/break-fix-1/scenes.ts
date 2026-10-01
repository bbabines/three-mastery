import { ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { rotatedBoxHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(7, 4, 8);
  controls.target.set(1.5, 1, 0);
  const localBox = new THREE.Box3(new THREE.Vector3(-1, -0.7, -0.6), new THREE.Vector3(1, 0.7, 0.6));
  const boxToWorld = new THREE.Matrix4().compose(new THREE.Vector3(2, 1.1, 0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.6), new THREE.Vector3(1, 1, 1));
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 1.4, 1.2), new THREE.MeshBasicMaterial({ color: COLORS.blue, wireframe: true }));
  box.applyMatrix4(boxToWorld);
  scene.add(box);
  const ray = new THREE.Ray(new THREE.Vector3(2, 1.1, 4), new THREE.Vector3(0, 0, -1));
  const path = line(COLORS.white);
  setLine(path, ray.origin, ray.at(6, new THREE.Vector3()));
  scene.add(path);
  const localRay = ray.clone().applyMatrix4(boxToWorld.clone().invert());
  const expected = localRay.intersectBox(localBox, new THREE.Vector3())?.applyMatrix4(boxToWorld) ?? null;
  let got: THREE.Vector3 | null = null;
  let error: unknown;
  try { got = rotatedBoxHit(ray, localBox, boxToWorld); } catch (caught) { error = caught; }
  if (expected) { const mark = ball(COLORS.yellow); mark.position.copy(expected); scene.add(mark); }
  if (got) { const mark = ball(COLORS.red); mark.position.copy(got); scene.add(mark); }
  const readout = overlay(container, 'readout');
  readout.textContent = error
    ? `rotatedBoxHit threw: ${String(error)}`
    : `white: ray | blue: rotated box\nyellow: first world hit | red: your hit\npoints apart: ${got && expected ? got.distanceTo(expected).toFixed(2) : 'your hit is missing'}`;
};
