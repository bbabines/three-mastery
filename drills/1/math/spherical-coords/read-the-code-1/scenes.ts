// Scenes for the spherical coordinates page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, formatVector, label, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const orbit: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7);
  controls.target.set(0, 1, 0);

  const center = new THREE.Vector3(0, 1, 0);
  const values = { radius: 2.5, phi: 60, theta: 45 };

  const centerBall = ball(COLORS.red);
  centerBall.position.copy(center);
  const centerTag = label('center', COLORS.red);
  centerTag.position.set(0.55, 0.8, 0);

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 12),
    new THREE.MeshBasicMaterial({ color: COLORS.gray, wireframe: true, transparent: true, opacity: 0.12 }),
  );
  shell.position.copy(center);
  const top = line(COLORS.green, 0.8);
  const topTag = label('phi 0: straight up', COLORS.green);

  // The orbiting camera: a cone whose tip, along +Z, lookAt turns toward the center.
  const orbiter = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.5, 20).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: COLORS.yellow }),
  );
  const arm = line(COLORS.yellow, 0.7);
  scene.add(centerBall, centerTag, shell, top, topTag, orbiter, arm);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');

  const update = () => {
    const { radius, phi, theta } = values;
    const spherical = new THREE.Spherical(radius, THREE.MathUtils.degToRad(phi), THREE.MathUtils.degToRad(theta));
    const offset = new THREE.Vector3().setFromSpherical(spherical);
    orbiter.position.copy(center).add(offset);
    orbiter.lookAt(center);
    setLine(arm, center, orbiter.position);
    shell.scale.setScalar(radius);
    setLine(top, center, center.clone().add(new THREE.Vector3(0, radius + 0.4, 0)));
    topTag.position.set(1.3, center.y + radius + 0.4, 0); // off to the side, clear of the readout

    const atPole = phi === 0 || phi === 180;
    readout.textContent = [
      `new Spherical(${formatNumber(radius, 1)}, phi ${phi}°, theta ${theta}°)`,
      `position from the center ${formatVector(offset)}`,
      atPole ? 'At the pole: theta no longer changes anything.' : '',
    ].join('\n');
  };
  slider(sliders, 'radius', { min: 1, max: 3, step: 0.1, value: values.radius }, (value) => {
    values.radius = value;
    update();
  });
  slider(sliders, 'phi', { min: 0, max: 180, step: 5, value: values.phi }, (value) => {
    values.phi = value;
    update();
  });
  slider(sliders, 'theta', { min: 0, max: 360, step: 5, value: values.theta }, (value) => {
    values.theta = value;
    update();
  });
  update();
};
