import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { variant } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 0.6, 0);
  const source = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  source.position.set(-1.2, 0.6, 0);
  scene.add(source);
  const got = attempt('variant', () => variant(source));
  const readout = overlay(container, 'readout');
  if (!got.ok) { readout.textContent = got.note; return; }
  const copy = got.value;
  copy.position.x = 1.2;
  scene.add(copy);
  (copy.material as THREE.MeshStandardMaterial).color.set(COLORS.yellow);
  const sourceColor = (source.material as THREE.MeshStandardMaterial).color.getHexString();
  readout.textContent = `left: original | right: recolored copy\noriginal stayed blue: ${sourceColor === new THREE.Color(COLORS.blue).getHexString()}`;
};
