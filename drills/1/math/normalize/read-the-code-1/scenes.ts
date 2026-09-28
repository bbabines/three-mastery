// Scenes for the normalize page. The README places each one with <div data-scene="name">.
import { arrow, ball, COLORS, formatNumber, formatVector, label, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const compass: SceneSetup = ({ scene, camera, container }) => {
  camera.position.set(0.5, 6, 5);

  // Just above the floor, so the arrows and ring don't hide in the grid.
  const origin = new THREE.Vector3(0, 0.05, 0);
  const target = new THREE.Vector3(2, 0.05, -2);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.98, 1.02, 64).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: COLORS.white }),
  );
  ring.position.copy(origin);
  const ringTag = label('length 1', COLORS.white);
  ringTag.position.set(-1.1, 0.2, 0.8);
  const targetBall = ball(COLORS.orange);
  const full = arrow(COLORS.yellow);
  const unit = arrow(COLORS.green);
  const justAbove = origin.clone().setY(0.07); // keeps the green arrow visible where they overlap
  scene.add(ring, ringTag, targetBall, full, unit);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');

  const update = () => {
    targetBall.position.copy(target);
    const v = target.clone().sub(origin);
    const normalized = v.clone().normalize();
    setArrow(full, origin, v);
    setArrow(unit, justAbove, normalized);

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">v                  ${formatVector(v)}   length ${formatNumber(v.length())}</span>`,
      `<span style="color:${COLORS.green}">v.clone().normalize() ${formatVector(normalized, 2)}   length ${formatNumber(normalized.length())}</span>`,
      v.lengthSq() === 0 ? 'The target is at the center: there is no direction to keep.' : '',
    ].join('\n');
  };
  slider(sliders, 'target x', { min: -3, max: 3, step: 0.5, value: target.x }, (value) => {
    target.x = value;
    update();
  });
  slider(sliders, 'target z', { min: -3, max: 3, step: 0.5, value: target.z }, (value) => {
    target.z = value;
    update();
  });
  update();
};
