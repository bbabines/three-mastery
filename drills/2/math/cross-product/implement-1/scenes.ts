// Runs drill.ts live: the blue arrow is the forward the sliders set, and the red and green arrows are
// the right and up axesFor returns.
import { arrow, attempt, COLORS, formatNumber, formatVector, label, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { axesFor } from './drill';

const ORIGIN = new THREE.Vector3(0, 1.2, 0);
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const LENGTH = 1.4;

export const axes: SceneSetup = ({ scene, camera, controls, container }) => {
  // From here, none of the three arrows points straight at or away from the viewer.
  camera.position.set(4.2, 2.9, 2.2);
  controls.target.set(0, 1.5, 0);

  const forwardArrow = arrow(COLORS.blue);
  const rightArrow = arrow(COLORS.red);
  const upArrow = arrow(COLORS.green);
  const worldUpArrow = arrow(COLORS.gray);
  setArrow(worldUpArrow, new THREE.Vector3(-1.2, 0.05, 1.2), WORLD_UP.clone().multiplyScalar(0.8));
  const tags = {
    forward: label('forward', COLORS.blue),
    right: label('right', COLORS.red),
    up: label('up', COLORS.green),
    worldUp: label('worldUp', COLORS.gray),
  };
  tags.worldUp.position.set(-1.2, 1.1, 1.2);
  scene.add(forwardArrow, rightArrow, upArrow, worldUpArrow, ...Object.values(tags));

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { turn: 30, tilt: 20 };

  const show = (helper: THREE.ArrowHelper, tag: THREE.Sprite, direction: THREE.Vector3 | undefined) => {
    helper.visible = tag.visible = direction !== undefined;
    if (!direction) return;
    setArrow(helper, ORIGIN, direction.clone().multiplyScalar(LENGTH));
    tag.visible = helper.visible;
    tag.position.copy(ORIGIN).addScaledVector(direction, LENGTH + 0.3);
  };

  const update = () => {
    const turn = THREE.MathUtils.degToRad(values.turn);
    const tilt = THREE.MathUtils.degToRad(values.tilt);
    const forward = new THREE.Vector3(-Math.sin(turn) * Math.cos(tilt), Math.sin(tilt), -Math.cos(turn) * Math.cos(tilt));
    show(forwardArrow, tags.forward, forward);

    const result = attempt('axesFor', () => axesFor(forward.clone(), WORLD_UP.clone()));
    show(rightArrow, tags.right, result.ok ? result.value.right : undefined);
    show(upArrow, tags.up, result.ok ? result.value.up : undefined);
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    const { right, up } = result.value;
    const square = Math.abs(right.dot(up)) < 1e-6 && Math.abs(right.dot(forward)) < 1e-6 && Math.abs(up.dot(forward)) < 1e-6;
    readout.textContent = [
      `right  ${formatVector(right, 2)}  length ${formatNumber(right.length())}`,
      `up     ${formatVector(up, 2)}  length ${formatNumber(up.length())}`,
      square ? 'all three at right angles' : 'not all at right angles',
    ].join('\n');
  };

  slider(bar, 'turn', { min: 0, max: 360, step: 5, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(bar, 'tilt', { min: -90, max: 90, step: 5, value: values.tilt }, (value) => {
    values.tilt = value;
    update();
  });
  update();
};
