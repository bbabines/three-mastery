import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { assignFaceUv } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2, 2.5, 5); controls.target.set(0, 0.7, 0);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const display = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.green, wireframe: true, side: THREE.DoubleSide }));
  display.position.y = 0.8; scene.add(display);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Retile the first face only');
  let shiftU = 1;
  const update = () => {
    const offset = new THREE.Vector2(shiftU, 0.5);
    const original = geometry.getAttribute('uv');
    const firstId = geometry.index!.getX(0), laterId = geometry.index!.getX(3);
    const result = attempt('assignFaceUv', () => assignFaceUv(geometry, offset.clone()));
    show(`first face shift U ${shiftU.toFixed(1)}, V 0.5`,
      result.ok ? `first U ${result.value.getAttribute('uv').getX(0).toFixed(1)} · later U ${result.value.getAttribute('uv').getX(3).toFixed(1)} · groups ${result.value.groups.length}` : result.note,
      `first U ${(original.getX(firstId) + shiftU).toFixed(1)} · later U ${original.getX(laterId).toFixed(1)} · groups 2`);
  };
  slider(controlsBar, 'shift U', { min: 0, max: 2, step: 0.5, value: shiftU }, value => { shiftU = value; update(); });
  update();
};
