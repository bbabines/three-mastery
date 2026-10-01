import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { colorFaultArea } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const colorMap=new THREE.Texture(); const colorMaterial=new THREE.MeshStandardMaterial({map:colorMap}); const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); scene.add(mesh);
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const result = attempt('colorFaultArea', () => colorFaultArea(colorMaterial,renderer.outputColorSpace));
    readout.textContent = (result.ok ? `inspect color: ${result.value}` : result.note);
  });
};
