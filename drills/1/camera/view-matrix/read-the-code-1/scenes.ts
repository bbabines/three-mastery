// Scenes for the view matrix page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, line, overlay, setLine, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Shows each of a vector's three numbers in the color of the axis it's measured along.
const axisColored = (v: THREE.Vector3) =>
  `(<span style="color:${COLORS.red}">${formatNumber(v.x, 1)}</span>, ` +
  `<span style="color:${COLORS.green}">${formatNumber(v.y, 1)}</span>, ` +
  `<span style="color:${COLORS.blue}">${formatNumber(v.z, 1)}</span>)`;

export const fromCamera: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.3, 2.5, 4.3);
  controls.target.set(0.2, 1.1, 0.6);

  const eye = new THREE.PerspectiveCamera(40, 1.5, 0.3, 4);
  const helper = showCamera(eye);
  // Inside the camera, so they run along its own right, up, and back: the three numbers.
  const alongX = line(COLORS.red);
  const alongY = line(COLORS.green);
  const alongZ = line(COLORS.blue);
  eye.add(alongX, alongY, alongZ);
  const eyeTag = label('camera', COLORS.gray);
  eyeTag.position.set(0, 0.4, 0.2);
  eye.add(eyeTag);

  const target = ball(COLORS.yellow);
  target.position.set(1.3, 1.8, -1);
  const targetTag = label('ball', COLORS.yellow);
  targetTag.position.copy(target.position).add(LABEL_LIFT);
  scene.add(eye, helper, target, targetTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { x: 0, turn: 0 };
  const origin = new THREE.Vector3();

  const update = () => {
    eye.position.set(values.x, 1, 2.5);
    eye.rotation.y = THREE.MathUtils.degToRad(values.turn);
    eye.updateMatrixWorld(); // the scene reads the view matrix before the next render refreshes it

    const v = target.position.clone().applyMatrix4(eye.matrixWorldInverse);
    const cornerX = new THREE.Vector3(v.x, 0, 0);
    const cornerY = new THREE.Vector3(v.x, v.y, 0);
    setLine(alongX, origin, cornerX);
    setLine(alongY, cornerX, cornerY);
    setLine(alongZ, cornerY, v);

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">●</span> ball.position  ${formatVector(target.position)}  in the world`,
      `<span style="color:${COLORS.yellow}">●</span> ball.position.clone().applyMatrix4(camera.matrixWorldInverse)`,
      `    ${axisColored(v)}  measured from the camera`,
      v.z < 0 ? `    ${formatNumber(-v.z, 1)} in front of the camera` : '    behind the camera: z is positive',
    ].join('\n');
  };
  slider(sliders, 'move camera', { min: -2, max: 2, step: 0.5, value: values.x }, (value) => {
    values.x = value;
    update();
  });
  slider(sliders, 'turn camera', { min: -90, max: 90, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  update();
};

// The tooltip's spot, measured from the camera: 0.3 up and 1.5 in front.
const OFFSET = new THREE.Vector3(0, 0.3, -1.5);

export const inFront: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4.6, 2.4, 3.4);
  controls.target.set(-0.2, 0.3, -1);

  const eye = new THREE.PerspectiveCamera(40, 1.5, 0.3, 2.2);
  const helper = showCamera(eye);
  const eyeTag = label('camera', COLORS.gray);
  eyeTag.position.set(0, 0.4, 0.2);
  eye.add(eyeTag);

  const spot = ball(COLORS.yellow, 1, 0.08);
  const tooltip = label('tooltip', COLORS.yellow);
  const link = line(COLORS.yellow, 0.5); // from the camera to where the tooltip landed
  scene.add(eye, helper, spot, tooltip, link);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { x: 0, turn: 0 };
  let useInverse = false;

  const update = () => {
    eye.position.set(values.x, 1.2, 1.5);
    eye.rotation.y = THREE.MathUtils.degToRad(values.turn);
    eye.updateMatrixWorld(); // refreshes matrixWorld and matrixWorldInverse

    spot.position.copy(OFFSET).applyMatrix4(useInverse ? eye.matrixWorldInverse : eye.matrixWorld);
    tooltip.position.copy(spot.position).add(new THREE.Vector3(0, 0.25, 0));
    setLine(link, eye.position, spot.position);

    readout.innerHTML = [
      `tooltip.position.set(0, 0.3, -1.5).applyMatrix4(camera.${useInverse ? 'matrixWorldInverse' : 'matrixWorld'})`,
      `<span style="color:${COLORS.yellow}">●</span> tooltip  ${formatVector(spot.position)}  in the world`,
      useInverse ? 'Lost: it moves the opposite way to the camera.' : 'Stays 0.3 up and 1.5 in front of the camera.',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>camera.matrixWorld</code>',
      select: () => {
        useInverse = false;
        update();
      },
    },
    {
      html: '<code>camera.matrixWorldInverse</code>',
      select: () => {
        useInverse = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'move camera', { min: -1.5, max: 1.5, step: 0.5, value: values.x }, (value) => {
    values.x = value;
    update();
  });
  slider(controlsBar, 'turn camera', { min: -60, max: 60, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
};
