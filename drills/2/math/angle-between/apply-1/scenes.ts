// Runs drill.ts live: heading() gets the way the drone faces, and the yellow needle on the compass
// points along the heading it returns. The grey arrow is the drone's own facing, flattened.
import { arrow, attempt, COLORS, formatNumber, label, overlay, pointer, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { heading } from './drill';

const NORTH = new THREE.Vector3(0, 0, -1);
const UP = new THREE.Vector3(0, 1, 0);
const DRONE = new THREE.Vector3(0, 1.2, 0);
const NEEDLE = 1.5;

export const compass: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.2, 3.6, 3.4);
  controls.target.set(0, 0.4, 0);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.8, 1.86, 96).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: COLORS.gray, side: THREE.DoubleSide }),
  );
  ring.position.y = 0.05;
  scene.add(ring);
  for (const [text, degrees] of [['N', 0], ['E', 90], ['S', 180], ['W', 270]] as const) {
    const tag = label(text, COLORS.white);
    tag.position.copy(NORTH).applyAxisAngle(UP, -THREE.MathUtils.degToRad(degrees)).multiplyScalar(2.2).setY(0.2);
    scene.add(tag);
  }

  // A flat needle lying on the compass, its tip along +Z so lookAt can aim it.
  const needle = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, NEEDLE, 16).rotateX(Math.PI / 2).translate(0, 0, NEEDLE / 2),
    new THREE.MeshStandardMaterial({ color: COLORS.yellow }),
  );
  needle.position.set(0, 0.1, 0);
  const facing = arrow(COLORS.gray);
  const drone = pointer(COLORS.white, 0.8);
  drone.position.copy(DRONE);
  scene.add(needle, facing, drone);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { turn: 120, tilt: 25 };

  const update = () => {
    const forward = NORTH.clone().applyAxisAngle(UP, -THREE.MathUtils.degToRad(values.turn));
    const side = new THREE.Vector3().crossVectors(forward, UP);
    forward.applyAxisAngle(side, THREE.MathUtils.degToRad(values.tilt));
    drone.lookAt(DRONE.clone().add(forward));
    const flat = forward.clone().setY(0);
    setArrow(facing, new THREE.Vector3(0, 0.16, 0), flat.clone().setLength(NEEDLE + 0.2));

    const result = attempt('heading', () => heading(forward.clone()));
    needle.visible = result.ok;
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    const pointing = NORTH.clone().applyAxisAngle(UP, -THREE.MathUtils.degToRad(result.value));
    needle.lookAt(needle.position.clone().add(pointing));
    const matches = pointing.angleTo(flat) < THREE.MathUtils.degToRad(0.5);
    readout.textContent = [
      `heading(drone forward)  ${formatNumber(result.value, 1)}°`,
      matches ? 'the needle matches the drone' : "the needle doesn't match the drone",
    ].join('\n');
  };

  slider(bar, 'turn', { min: 0, max: 360, step: 5, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(bar, 'tilt', { min: -80, max: 80, step: 5, value: values.tilt }, (value) => {
    values.tilt = value;
    update();
  });
  update();
};
