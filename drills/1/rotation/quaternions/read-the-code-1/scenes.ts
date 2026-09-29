// Scenes for the quaternions page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, line, overlay, setLine, ship, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const inside: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.9, 2.5, 2.9);
  controls.target.set(0, 1.5, 0);

  const center = new THREE.Vector3(0, 1.4, 0);
  const craft = ship(COLORS.yellow);
  craft.position.copy(center);
  const axisLine = line(COLORS.purple);
  scene.add(craft, axisLine);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const axes = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.6, 0.8, 0)];
  let axis = axes[0];
  let degrees = 90;

  const update = () => {
    const radians = THREE.MathUtils.degToRad(degrees);
    craft.quaternion.setFromAxisAngle(axis, radians);
    setLine(axisLine, center.clone().addScaledVector(axis, -1.3), center.clone().addScaledVector(axis, 1.3));

    const q = craft.quaternion;
    const note =
      degrees === 0
        ? 'w = 1: no turn at all'
        : degrees === 180
          ? 'w = 0: a half turn'
          : degrees === 360
            ? 'w = −1: a full turn, the same as no turn'
            : 'x, y, z lie along the axis; w says how far round';
    readout.innerHTML = [
      `ship.quaternion.setFromAxisAngle(${formatVector(axis)}, ${formatNumber(radians)})   // ${degrees}°`,
      `x ${formatNumber(q.x)}   y ${formatNumber(q.y)}   z ${formatNumber(q.z)}   w ${formatNumber(q.w)}   length ${formatNumber(q.length())}`,
      note,
    ].join('\n');
  };
  choiceButtons(
    controlsBar,
    axes.map((choice) => ({
      html: `axis <code>${formatVector(choice)}</code>`,
      select: () => {
        axis = choice;
        update();
      },
    })),
  );
  slider(controlsBar, 'Angle', { min: 0, max: 360, step: 15, value: degrees }, (value) => {
    degrees = value;
    update();
  });
};

export const combine: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.1, 2.3, 3);
  controls.target.set(0.2, 1.5, 0);

  const center = new THREE.Vector3(0, 1.4, 0);
  const start = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); // nose to +X
  const ghost = ship(COLORS.gray, 0.3);
  ghost.position.copy(center);
  ghost.quaternion.copy(start);
  const craft = ship(COLORS.yellow);
  craft.position.copy(center);
  scene.add(ghost, craft);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const xAxis = new THREE.Vector3(1, 0, 0);
  const tip = new THREE.Quaternion();
  let pre = false;
  let degrees = 45;
  const nose = new THREE.Vector3();
  const fin = new THREE.Vector3();

  const update = () => {
    tip.setFromAxisAngle(xAxis, THREE.MathUtils.degToRad(-degrees));
    craft.quaternion.copy(start);
    if (pre) craft.quaternion.premultiply(tip);
    else craft.quaternion.multiply(tip);
    nose.set(0, 0, 1).applyQuaternion(craft.quaternion);
    fin.set(0, 1, 0).applyQuaternion(craft.quaternion);

    readout.innerHTML = [
      `ship.quaternion.${pre ? 'premultiply' : 'multiply'}(tip)   // tip: −${degrees}° around (1, 0, 0)`,
      `nose (+Z) ${formatVector(nose, 2)}   fin (+Y) ${formatVector(fin, 2)}`,
      pre ? "rolls around its nose: the parent's X runs along it" : 'tips its nose up, around its own side-to-side axis',
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>multiply(tip)</code>',
      select: () => {
        pre = false;
        update();
      },
    },
    {
      html: '<code>premultiply(tip)</code>',
      select: () => {
        pre = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Tip', { min: 0, max: 90, step: 15, value: degrees }, (value) => {
    degrees = value;
    update();
  });
};
