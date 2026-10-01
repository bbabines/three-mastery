import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { inCameraView, boundsHelper } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const object = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); object.position.x=0.8; scene.add(object); let displayedHelper: THREE.BoxHelper | null=null;
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const shown = attempt('inCameraView', () => inCameraView(object,camera)); const helper = attempt('boundsHelper', () => displayedHelper ?? boundsHelper(object)); if (helper.ok && !displayedHelper) {scene.add(helper.value); displayedHelper=helper.value;}
    readout.textContent = ([shown.ok ? `in view: ${shown.value}` : shown.note, helper.ok ? 'bounds helper made' : helper.note].join('\n'));
  });
};
