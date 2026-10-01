import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { normalFromMap } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.7, 0);
  const tangent = new THREE.Vector3(1, 0, 0), bitangent = new THREE.Vector3(0, 1, 0), normal = new THREE.Vector3(0, 0, 1);
  const yours = arrow(COLORS.blue), reference = arrow(COLORS.green);
  scene.add(yours, reference);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Map sample → world normal');
  let sampleX = 0.7;
  const update = () => {
    const sample = new THREE.Vector3(sampleX, 0.3, 0.9);
    const expected = new THREE.Vector3(2 * sampleX - 1, -0.4, 0.8).normalize();
    const result = attempt('normalFromMap', () => normalFromMap(sample.clone(), tangent.clone(), bitangent.clone(), normal.clone()));
    const base = new THREE.Vector3(0, 0.8, 0);
    setArrow(reference, base, expected.multiplyScalar(1.5));
    yours.visible = result.ok;
    if (result.ok) setArrow(yours, base, result.value.clone().multiplyScalar(1.5));
    show(`sample RGB (${sampleX.toFixed(1)}, 0.3, 0.9)`,
      result.ok ? `world normal (${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}, ${result.value.z.toFixed(2)})` : result.note,
      `world normal (${(expected.x / 1.5).toFixed(2)}, ${(expected.y / 1.5).toFixed(2)}, ${(expected.z / 1.5).toFixed(2)})`);
  };
  slider(controlsBar, 'sample red', { min: 0, max: 1, step: 0.1, value: sampleX }, value => { sampleX = value; update(); });
  update();
};
