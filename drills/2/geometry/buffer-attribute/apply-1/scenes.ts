import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { vertexColor } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.6, 0);
  const colors = new THREE.Float32BufferAttribute([1, 0.2, 0.2, 0.2, 0.9, 0.2, 0.2, 0.4, 1], 3);
  const markers = [0, 1, 2].map(i => {
    const marker = ball(new THREE.Color(colors.getX(i), colors.getY(i), colors.getZ(i)).getStyle(), 1, 0.18);
    marker.position.set(i - 1, 0.6, 0); scene.add(marker); return marker;
  });
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Read RGB by vertex number');
  let index = 1;
  const update = () => {
    markers.forEach((marker, i) => marker.scale.setScalar(i === index ? 1.6 : 1));
    const result = attempt('vertexColor', () => vertexColor(colors, index));
    show(`vertex ${index} of 3`,
      result.ok ? `RGB (${result.value.x.toFixed(1)}, ${result.value.y.toFixed(1)}, ${result.value.z.toFixed(1)})` : result.note,
      `RGB (${colors.getX(index).toFixed(1)}, ${colors.getY(index).toFixed(1)}, ${colors.getZ(index).toFixed(1)})`);
  };
  slider(controlsBar, 'vertex', { min: 0, max: 2, step: 1, value: index }, value => { index = value; update(); });
  update();
};
