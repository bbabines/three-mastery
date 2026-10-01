import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { canSee } from './drill';

const HALF_ANGLE = Math.PI / 4;
const REACH = 2.3;

export const scanner: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.6, 5.2);
  controls.target.set(0, 0, 1);

  const scannerBody = ball(COLORS.gray, 1, 0.22);
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(Math.tan(HALF_ANGLE) * REACH, REACH, 48).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: COLORS.green, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
  );
  cone.position.z = REACH / 2;
  const target = ball(COLORS.yellow, 1, 0.12);
  scene.add(scannerBody, cone, target);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (degrees: number) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    target.position.set(Math.sin(radians) * REACH, 0, Math.cos(radians) * REACH);
    const facing = new THREE.Vector3(0, 0, 3);
    const toward = target.position.clone();
    const expected = facing.angleTo(toward) <= HALF_ANGLE;
    const result = attempt('canSee', () => canSee(facing.clone(), toward.clone(), HALF_ANGLE));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    readout.textContent = [
      `scanner says: ${result.value ? 'detected' : 'clear'}`,
      `target is ${expected ? 'inside' : 'outside'} the cone`,
      result.value === expected ? 'the decision matches the cone' : 'the decision disagrees with the cone',
    ].join('\n');
  };
  slider(controlsBar, 'target angle', { min: -180, max: 180, step: 5, value: 80 }, update);
  update(80);
};
