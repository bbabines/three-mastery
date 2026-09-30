// Runs drill.ts live: the bracket sits at its start plus alongRail(drag, rail). The grey ball is the
// pointer, and the grey arrow is the drag.
import { arrow, attempt, ball, COLORS, formatVector, line, overlay, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { alongRail } from './drill';

const RAIL = new THREE.Vector3(1, 0, -0.7);
const START = new THREE.Vector3(0, 0.15, 0);

export const rail: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 3.9, 3.3);
  controls.target.set(0, 0, 0.2);

  const track = line(COLORS.white);
  const reach = RAIL.clone().setLength(3.6);
  setLine(track, START.clone().sub(reach).setY(0.05), START.clone().add(reach).setY(0.05));
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  bracket.lookAt(RAIL); // its long side along the rail
  const pointerBall = ball(COLORS.gray, 1, 0.1);
  const dragArrow = arrow(COLORS.gray);
  const leftover = line(COLORS.gray, 0.5);
  scene.add(track, bracket, pointerBall, dragArrow, leftover);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const drag = new THREE.Vector3(1.6, 0, 0.9);

  const update = () => {
    const pointerAt = START.clone().add(drag);
    pointerBall.position.copy(pointerAt);
    setArrow(dragArrow, START, drag);

    const result = attempt('alongRail', () => alongRail(drag.clone(), RAIL.clone()));
    bracket.visible = leftover.visible = result.ok;
    if (!result.ok) {
      bracket.position.copy(START);
      bracket.visible = true;
      readout.textContent = result.note;
      return;
    }
    bracket.position.copy(START).add(result.value);
    setLine(leftover, bracket.position, pointerAt);
    const onRail = new THREE.Vector3().crossVectors(result.value, RAIL).length() < 1e-6;
    readout.textContent = [
      `alongRail(drag, rail)  ${formatVector(result.value, 2)}`,
      onRail ? 'the bracket stays on the rail' : 'the bracket leaves the rail',
    ].join('\n');
  };

  slider(bar, 'drag across', { min: -2.5, max: 2.5, step: 0.05, value: drag.x }, (value) => {
    drag.x = value;
    update();
  });
  slider(bar, 'drag deep', { min: -2.5, max: 2.5, step: 0.05, value: drag.z }, (value) => {
    drag.z = value;
    update();
  });
  update();
};
