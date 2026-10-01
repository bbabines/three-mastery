import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { showOnlyBranch } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const root = new THREE.Group(); const keep = new THREE.Group(); keep.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue}))); root.add(keep,new THREE.Group(),new THREE.Group()); scene.add(root);
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const result = attempt('showOnlyBranch', () => showOnlyBranch(root,keep));
    readout.textContent = (result.ok ? `branches hidden: ${result.value}` : result.note);
  });
};
