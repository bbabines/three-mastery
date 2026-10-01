import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldArrowDirection, finiteOrZero } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const object = new THREE.Group(); object.rotation.y=0.5; scene.add(object); const local = new THREE.Vector3(1,0,0);
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const direction = attempt('worldArrowDirection', () => worldArrowDirection(object,local)); const safe = attempt('finiteOrZero', () => finiteOrZero(new THREE.Vector3(Number.NaN,1,0)));
    readout.textContent = ([direction.ok ? `world arrow: ${direction.value.toArray().map(n=>n.toFixed(2)).join(', ')}` : direction.note, safe.ok ? `safe vector: ${safe.value.toArray().join(', ')}` : safe.note].join('\n'));
  });
};
