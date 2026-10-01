import { attempt, ball, COLORS, line, overlay, setLine, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldToView } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 9);
  controls.target.set(0, 1, 1);
  const worldPoint = new THREE.Vector3(0, 1, 0);
  const fixed = ball(COLORS.yellow, 1, 0.2);
  fixed.position.copy(worldPoint);
  scene.add(fixed);
  const eye = new THREE.PerspectiveCamera(50, 1, 0.1, 20);
  eye.position.set(2, 1, 4);
  const helper = showCamera(eye);
  scene.add(eye, helper);
  const rail = line(COLORS.gray);
  setLine(rail, new THREE.Vector3(-3, 0.2, 0), new THREE.Vector3(3, 0.2, 0));
  const yours = ball(COLORS.blue, 1, 0.16);
  const reference = ball(COLORS.green, 1, 0.16);
  scene.add(rail, yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (x: number) => {
    eye.position.x = x;
    eye.updateWorldMatrix(true, false);
    helper.update();
    const result = attempt('worldToView', () => worldToView(eye, worldPoint.clone()));
    const expected = worldPoint.clone().applyMatrix4(eye.matrixWorldInverse);
    reference.position.set(expected.x, 0.65, 0);
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.position.set(result.value.x, 0.65, 0.35);
    readout.textContent = `camera x ${x.toFixed(1)} · yellow world point stays fixed\nview x: blue ${result.value.x.toFixed(1)} · green reference ${expected.x.toFixed(1)}`;
  };
  slider(controlsBar, 'camera x', { min: -2, max: 2, step: 0.25, value: 2 }, update);
  update(2);
};
