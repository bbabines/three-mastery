// Scenes for the camera-relative directions page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, formatNumber, formatVector, overlay, setArrow, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const cameraArrows: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.1, 3.1, 3.9);
  controls.target.set(0, 1.3, 0);

  const eye = new THREE.PerspectiveCamera(40, 1.5, 0.3, 1.1);
  eye.position.set(0, 1.5, 0);
  eye.rotation.order = 'YXZ'; // turn left and right first, then tilt: no roll
  const helper = showCamera(eye);
  const forwardArrow = arrow(COLORS.yellow);
  const rightArrow = arrow(COLORS.red);
  const upArrow = arrow(COLORS.green);
  scene.add(eye, helper, forwardArrow, rightArrow, upArrow);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { turn: 30, tilt: -30 };
  let fromCross = false;

  const update = () => {
    eye.rotation.set(THREE.MathUtils.degToRad(values.tilt), THREE.MathUtils.degToRad(values.turn), 0);
    eye.updateMatrixWorld(); // the columns are read from the saved matrix below

    const forward = eye.getWorldDirection(new THREE.Vector3());
    const columnRight = new THREE.Vector3().setFromMatrixColumn(eye.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(eye.matrixWorld, 1);
    const crossed = forward.clone().cross(eye.up);
    const crossedLength = crossed.length();
    const right = fromCross ? crossed.clone().normalize() : columnRight;

    setArrow(forwardArrow, eye.position, forward.clone().multiplyScalar(1.4));
    setArrow(rightArrow, eye.position, right);
    setArrow(upArrow, eye.position, up);
    rightArrow.setColor(fromCross ? COLORS.orange : COLORS.red);

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">→</span> forward = camera.getWorldDirection(v)   ${formatVector(forward, 2)}`,
      fromCross
        ? `<span style="color:${COLORS.orange}">→</span> right = forward.clone().cross(camera.up).normalize()   ${formatVector(right, 2)}`
        : `<span style="color:${COLORS.red}">→</span> right = setFromMatrixColumn(camera.matrixWorld, 0)   ${formatVector(right, 2)}`,
      fromCross
        ? `    before normalize(): length ${crossedLength < 1e-3 ? crossedLength.toExponential(1) : formatNumber(crossedLength, 2)}` +
          (right.distanceTo(columnRight) > 1e-3 ? `; the real right is ${formatVector(columnRight, 2)}` : '')
        : `<span style="color:${COLORS.green}">→</span> up = setFromMatrixColumn(camera.matrixWorld, 1)   ${formatVector(up, 2)}`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'right: matrix column',
      select: () => {
        fromCross = false;
        update();
      },
    },
    {
      html: 'right: forward × up',
      select: () => {
        fromCross = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'turn', { min: -180, max: 180, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(controlsBar, 'tilt', { min: -90, max: 60, step: 15, value: values.tilt }, (value) => {
    values.tilt = value;
    update();
  });
};
