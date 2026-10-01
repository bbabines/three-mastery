import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { childRailPosition } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const parent = new THREE.Group(); parent.rotation.y=0.5; const child = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); parent.add(child); scene.add(parent); const drag = new THREE.Vector3(1,0,1), axis = new THREE.Vector3(1,0,0);
  {
    const expected = child.getWorldPosition(new THREE.Vector3()).add(drag.clone().projectOnVector(axis));
    marker.position.copy(expected);
    const result = attempt('childRailPosition', () => childRailPosition(child,drag,axis)); if (result.ok) child.position.copy(result.value);
    readout.textContent = result.ok ? `local rail position: ${result.value.x.toFixed(2)}, ${result.value.z.toFixed(2)}` : result.note;
  }
};
