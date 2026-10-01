import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { dragPosition } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 0.5, 0);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.5), new THREE.MeshBasicMaterial({ color: 0x31435e, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }));
  wall.position.y = 1.25;
  const yours = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.25), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  const reference = ball(COLORS.yellow, 1, 0.13);
  const cursor = ball(COLORS.red, 1, 0.09);
  scene.add(wall, yours, reference, cursor);
  const readout = overlay(container, 'readout');
  const offset = new THREE.Vector3(-0.35, 0.15, 0.2);

  onFrame((_, elapsed) => {
    const hit = new THREE.Vector3(Math.sin(elapsed * 0.8), 1.1 + 0.25 * Math.cos(elapsed * 0.8), 0.03);
    const expected = hit.clone().add(offset);
    cursor.position.copy(hit);
    reference.position.copy(expected);
    const result = attempt('dragPosition', () => dragPosition(hit.clone(), offset.clone()));
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.position.copy(result.value);
    readout.textContent = `red: grabbed spot on the wall
blue: your part; yellow: correct part origin
snap distance: ${result.value.distanceTo(expected).toFixed(2)} world units`;
  });
};
