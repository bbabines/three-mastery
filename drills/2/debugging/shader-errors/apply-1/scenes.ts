import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { authoredShaderLine, debugViewMaterial } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const mesh: THREE.Mesh<THREE.BoxGeometry, THREE.Material> = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); scene.add(mesh); let materialSet=false;
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const line = attempt('authoredShaderLine', () => authoredShaderLine('ERROR: 0:137: unknown name',120)); const material = materialSet ? attempt('debugViewMaterial', () => mesh.material) : attempt('debugViewMaterial', () => debugViewMaterial('normal')); if (material.ok && !materialSet) {mesh.material=material.value;materialSet=true;}
    readout.textContent = ([line.ok ? `authored shader line: ${line.value}` : line.note, material.ok ? `debug view: ${material.value.type}` : material.note].join('\n'));
  });
};
