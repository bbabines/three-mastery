// Scenes for the converting representations page. The README places each one with <div data-scene="name">.
import { COLORS, formatNumber, label, overlay, ship, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const roundTrip: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.9, 4);
  controls.target.set(0, 1.35, 0);

  const typed = ship(COLORS.yellow);
  typed.position.set(-1.2, 1.4, 0);
  const readBack = ship(COLORS.blue);
  readBack.position.set(1.2, 1.4, 0);
  const typedTag = label('the angles you set', COLORS.yellow);
  typedTag.position.set(-1.2, 2.35, 0);
  const backTag = label('the angles read back', COLORS.blue);
  backTag.position.set(1.2, 2.35, 0);
  scene.add(typed, readBack, typedTag, backTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const degrees = { x: 0, y: 120, z: 0 };
  const back = new THREE.Euler();
  const d = THREE.MathUtils.degToRad;
  const shown = (e: THREE.Euler) => [e.x, e.y, e.z].map((angle) => formatNumber(THREE.MathUtils.radToDeg(angle), 0)).join('°, ') + '°';

  const update = () => {
    typed.rotation.set(d(degrees.x), d(degrees.y), d(degrees.z));
    back.setFromQuaternion(typed.quaternion);
    readBack.rotation.copy(back);
    const apart = THREE.MathUtils.radToDeg(typed.quaternion.angleTo(readBack.quaternion));
    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">ship.rotation.set(…)</span>                      ${shown(typed.rotation)}`,
      `<span style="color:${COLORS.blue}">back.setFromQuaternion(ship.quaternion)</span>   ${shown(back)}`,
      `the two turns are ${formatNumber(apart < 0.01 ? 0 : apart, 0)}° apart: the same turn`,
    ].join('\n');
  };
  for (const axis of ['x', 'y', 'z'] as const) {
    slider(sliders, axis, { min: -180, max: 180, step: 15, value: degrees[axis] }, (value) => {
      degrees[axis] = value;
      update();
    });
  }
  update();
};
