import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { canvasNdc, wasDrag } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const rect = {left:100,top:50,width:400,height:200}; const down = new THREE.Vector2(100,100);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const point = attempt('canvasNdc', () => canvasNdc(200,100,rect)); const drag = attempt('wasDrag', () => wasDrag(down,new THREE.Vector2(106,105),5));
    readout.textContent = [point.ok ? `NDC: ${point.value.x.toFixed(2)}, ${point.value.y.toFixed(2)}` : point.note, drag.ok ? `drag: ${drag.value}` : drag.note].join('\n');
  });
};
