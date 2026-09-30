// Runs drill.ts live: the knob turns by dialTurn(center, from, to, axis), where `from` is the grey
// ball at the top and `to` is the yellow pointer the slider moves.
import { attempt, ball, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { dialTurn } from './drill';

const CENTER = new THREE.Vector3(0, 1.5, 0);
const AXIS = new THREE.Vector3(0, 0, 1); // the knob faces you
const REACH = 0.85; // how far from the center the pointer drags

export const dial: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.8, 3);
  controls.target.copy(CENTER);

  const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.4), new THREE.MeshStandardMaterial({ color: '#2a2e36' }));
  panel.position.copy(CENTER).setZ(-0.12);
  const knob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.6, 0.2, 48).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: COLORS.gray }),
  );
  knob.position.copy(CENTER);
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.04), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  notch.position.set(0, 0.35, 0.11);
  knob.add(notch);

  // The drag stays in the knob's face, as the task says; the balls are drawn just in front of it.
  const IN_FRONT = AXIS.clone().multiplyScalar(0.15);
  const from = CENTER.clone().add(new THREE.Vector3(0, REACH, 0));
  const start = ball(COLORS.gray, 1, 0.07);
  start.position.copy(from).add(IN_FRONT);
  const pointerBall = ball(COLORS.yellow, 1, 0.08);
  scene.add(panel, knob, start, pointerBall);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  const update = (degrees: number) => {
    const turn = THREE.MathUtils.degToRad(degrees);
    const to = from.clone().sub(CENTER).applyAxisAngle(AXIS, turn).add(CENTER);
    pointerBall.position.copy(to).add(IN_FRONT);

    const result = attempt('dialTurn', () => dialTurn(CENTER.clone(), from.clone(), to.clone(), AXIS.clone()));
    knob.rotation.z = result.ok ? result.value : 0;
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    // How far the notch is from the pointer, the short way round, so half a turn either way matches.
    const miss = Math.abs(Math.atan2(Math.sin(result.value - turn), Math.cos(result.value - turn)));
    readout.textContent = [
      `dialTurn(center, from, to, axis)  ${formatNumber(result.value)} (${formatNumber(THREE.MathUtils.radToDeg(result.value), 0)}°)`,
      miss < 1e-3 ? 'the notch follows the pointer' : 'the notch misses the pointer',
    ].join('\n');
  };

  slider(bar, 'pointer', { min: -180, max: 180, step: 5, value: 60 }, update);
  update(60);
};
