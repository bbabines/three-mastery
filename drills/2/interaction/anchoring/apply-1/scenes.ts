import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { labelUnoccluded } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 0, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const blocker = new THREE.Mesh(new THREE.BoxGeometry(1,1,0.2),new THREE.MeshStandardMaterial({color: COLORS.blue})); blocker.position.z=2; scene.add(blocker); blocker.updateMatrixWorld(); camera.position.set(0,0,5); camera.lookAt(0,0,0); camera.updateMatrixWorld();
  {
    const result = attempt('labelUnoccluded', () => labelUnoccluded(new THREE.Vector3(0,0,0),camera,[blocker]));
    marker.visible = result.ok && result.value;
    readout.textContent = result.ok ? `price tag visible: ${result.value}` : result.note;
  }
};
