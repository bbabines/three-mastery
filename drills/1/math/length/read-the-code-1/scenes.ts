// Scenes for the length page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, formatVector, label, LABEL_LIFT, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const distance: SceneSetup = ({ scene, camera, container }) => {
  camera.position.set(1, 7, 6);

  // Just above the floor, so the lines don't hide in the grid lines they run along.
  const a = new THREE.Vector3(-2, 0.05, 1);
  const b = new THREE.Vector3(1, 0.05, -3);

  const aBall = ball(COLORS.yellow);
  aBall.position.copy(a);
  const aTag = label('A', COLORS.yellow);
  aTag.position.copy(a).add(LABEL_LIFT);
  const bBall = ball(COLORS.orange);
  const bTag = label('B', COLORS.orange);
  const straight = line(COLORS.green);
  const eastWest = line(COLORS.gray, 0.7);
  const northSouth = line(COLORS.gray, 0.7);
  scene.add(aBall, aTag, bBall, bTag, straight, eastWest, northSouth);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');

  const update = () => {
    bBall.position.copy(b);
    bTag.position.copy(b).add(LABEL_LIFT);
    const corner = new THREE.Vector3(b.x, a.y, a.z);
    setLine(eastWest, a, corner);
    setLine(northSouth, corner, b);
    setLine(straight, a, b);

    const move = b.clone().sub(a);
    readout.innerHTML = [
      `move from A to B     ${formatVector(move)}`,
      `<span style="color:${COLORS.gray}">walking the blocks   ${formatNumber(Math.abs(move.x) + Math.abs(move.z))}</span>`,
      `<span style="color:${COLORS.green}">a.distanceTo(b)      ${formatNumber(a.distanceTo(b))}</span>`,
    ].join('\n');
  };
  slider(sliders, 'B x', { min: -3, max: 3, step: 0.5, value: b.x }, (value) => {
    b.x = value;
    update();
  });
  slider(sliders, 'B z', { min: -3, max: 3, step: 0.5, value: b.z }, (value) => {
    b.z = value;
    update();
  });
  update();
};
