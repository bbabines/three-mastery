import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { candidateLeafIds } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); root.userData.bounds = new THREE.Box3(new THREE.Vector3(-2,-1,-1),new THREE.Vector3(2,1,1)); const leaf = new THREE.Group(); leaf.userData.bounds = new THREE.Box3(new THREE.Vector3(0,-1,-1),new THREE.Vector3(1,1,1)); leaf.userData.leafId = "part"; root.add(leaf); const ray = new THREE.Ray(new THREE.Vector3(-3,0,0),new THREE.Vector3(1,0,0));
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('candidateLeafIds', () => candidateLeafIds(ray, root));
    readout.textContent = result.ok ? `candidate leaves: ${result.value.join(', ')}` : result.note;
  });
};
