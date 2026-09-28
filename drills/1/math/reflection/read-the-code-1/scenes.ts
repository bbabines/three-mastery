// Scenes for the reflection page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatVector, label, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const TRAVEL_SECONDS = 1.5;

export const bounce: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0.5, 2, 6);
  controls.target.set(0, 1, 0);

  const hit = new THREE.Vector3(0, 0.16, 0); // ball center when it touches the floor
  const velocity = new THREE.Vector3();
  const normal = new THREE.Vector3(0, 1, 0);
  const bounced = new THREE.Vector3();
  let degrees = 40;

  const normalArrow = arrow(COLORS.blue);
  const normalTag = label('normal', COLORS.blue);
  const inArrow = arrow(COLORS.yellow);
  const outArrow = arrow(COLORS.green);
  const runner = ball(COLORS.orange);
  scene.add(normalArrow, normalTag, inArrow, outArrow, runner);

  const readout = overlay(container, 'readout');
  const controlsPanel = overlay(container, 'controls');

  const update = () => {
    const radians = THREE.MathUtils.degToRad(degrees);
    velocity.set(Math.sin(radians), -Math.cos(radians), 0).multiplyScalar(1.8);
    bounced.copy(velocity).reflect(normal);

    setArrow(normalArrow, hit, normal);
    normalTag.position.copy(hit).addScaledVector(normal, 1.15).setX(-0.5);
    setArrow(inArrow, hit.clone().sub(velocity), velocity);
    setArrow(outArrow, hit, bounced);

    const lengthOne = normal.length() === 1;
    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">velocity                  ${formatVector(velocity)}</span>`,
      `<span style="color:${COLORS.green}">velocity.reflect(normal)  ${formatVector(bounced)}</span>`,
      lengthOne ? 'Same angle out as in.' : 'Far too fast: reflect assumes the normal has length 1.',
    ].join('\n');
  };

  onFrame((_, elapsed) => {
    const t = elapsed % (TRAVEL_SECONDS * 2);
    if (t < TRAVEL_SECONDS) runner.position.copy(hit).addScaledVector(velocity, t / TRAVEL_SECONDS - 1);
    else runner.position.copy(hit).addScaledVector(bounced, (t - TRAVEL_SECONDS) / TRAVEL_SECONDS);
  });

  slider(controlsPanel, 'angle', { min: 10, max: 80, step: 5, value: degrees }, (value) => {
    degrees = value;
    update();
  });
  choiceButtons(controlsPanel, [
    { html: 'normal length 1', select: () => { normal.set(0, 1, 0); update(); } },
    { html: 'normal length 2', select: () => { normal.set(0, 2, 0); update(); } },
  ]);
};
