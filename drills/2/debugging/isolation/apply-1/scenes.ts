import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { visibleSlice } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const root=new THREE.Group(); for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3),new THREE.MeshStandardMaterial({color: COLORS.blue})); m.name=`part-${i}`; m.position.x=i-2; root.add(m);} scene.add(root);
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const result = attempt('visibleSlice', () => visibleSlice(root,0,3));
    readout.textContent = (result.ok ? `visible: ${result.value.join(', ')}` : result.note);
  });
};
