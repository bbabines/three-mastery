import { attempt, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { selectableBoxHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 4, 8);
  controls.target.set(0, 0.6, 0);
  const helper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.5), new THREE.MeshBasicMaterial({ color: COLORS.yellow, wireframe: true }));
  helper.position.set(0, 0.8, 2);
  helper.name = 'helper';
  helper.userData.bounds = new THREE.Box3().setFromObject(helper);
  const part = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  part.position.set(0, 0.8, -1);
  part.name = 'selectable part';
  part.userData.selectable = true;
  part.userData.bounds = new THREE.Box3().setFromObject(part);
  scene.add(helper, part);
  const ray = new THREE.Ray(new THREE.Vector3(0, 0.8, 5), new THREE.Vector3(0, 0, -1));
  const path = line(COLORS.white);
  setLine(path, ray.origin, ray.at(7, new THREE.Vector3()));
  scene.add(path);
  const got = attempt('selectableBoxHit', () => selectableBoxHit(ray, [helper, part]));
  if (got.ok && got.value === part) (part.material as THREE.MeshStandardMaterial).color.set(COLORS.green);
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `yellow wire box: closer helper\nblue/green box: selectable part\nyour pick: ${got.value?.name ?? 'none'} | expected: selectable part`
    : got.note;
};
