import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { flipNormalGreen } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.8, 0);
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ color: COLORS.gray, side: THREE.DoubleSide }));
  surface.position.y = 0.8; scene.add(surface);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Convert the map’s green convention');
  let green = 0.2;
  const update = () => {
    const sample = new THREE.Vector3(0.6, green, 0.9);
    const result = attempt('flipNormalGreen', () => flipNormalGreen(sample.clone()));
    show(`source RGB (0.6, ${green.toFixed(1)}, 0.9)`,
      result.ok ? `RGB (${result.value.x.toFixed(1)}, ${result.value.y.toFixed(1)}, ${result.value.z.toFixed(1)})` : result.note,
      `RGB (0.6, ${(1 - green).toFixed(1)}, 0.9)`);
  };
  slider(controlsBar, 'source green', { min: 0, max: 1, step: 0.1, value: green }, value => { green = value; update(); });
  update();
};
