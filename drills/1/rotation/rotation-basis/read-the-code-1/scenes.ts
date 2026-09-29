// Scenes for the rotation matrix as a basis page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, formatNumber, formatVector, label, line, overlay, setArrow, setLine, ship, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const COLUMN_COLORS = [COLORS.red, COLORS.green, COLORS.blue];

export const columns: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.3, 2.6, 2.7);
  controls.target.set(0, 1.55, 0);

  const center = new THREE.Vector3(0, 1.5, 0);
  const craft = ship(COLORS.yellow);
  craft.position.copy(center);
  craft.rotation.order = 'YXZ'; // turn first, then tip
  const arrows = COLUMN_COLORS.map((color) => arrow(color));
  const tags = COLUMN_COLORS.map((color, i) => label(`column ${i + 1}`, color));
  scene.add(craft, ...arrows, ...tags);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { turn: 45, tip: -30, size: 1 };
  const axes = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

  const update = () => {
    craft.rotation.set(THREE.MathUtils.degToRad(values.tip), THREE.MathUtils.degToRad(values.turn), 0);
    craft.scale.setScalar(values.size);
    craft.updateMatrix();
    craft.matrix.extractBasis(axes[0], axes[1], axes[2]);

    axes.forEach((axis, i) => {
      setArrow(arrows[i], center, axis);
      tags[i].position.copy(center).addScaledVector(axis, 1 + 0.25 / axis.length());
    });
    const names = ['x (+X)', 'y (+Y)', 'z (+Z)'];
    readout.innerHTML = [
      'ship.matrix.extractBasis(x, y, z)',
      ...axes.map(
        (axis, i) =>
          `<span style="color:${COLUMN_COLORS[i]}">${names[i]}</span>  ${formatVector(axis, 2).padEnd(20)} length ${formatNumber(axis.length())}`,
      ),
    ].join('\n');
  };
  slider(sliders, 'Turn', { min: -180, max: 180, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(sliders, 'Tip', { min: -60, max: 60, step: 15, value: values.tip }, (value) => {
    values.tip = value;
    update();
  });
  slider(sliders, 'Size', { min: 0.5, max: 2, step: 0.25, value: values.size }, (value) => {
    values.size = value;
    update();
  });
  update();
};

export const build: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.6, 2.4, 2);
  controls.target.set(0, 1.35, 0);

  const center = new THREE.Vector3(0, 1.4, 0);
  const rail = line(COLORS.orange);
  const railTag = label('rail', COLORS.orange);
  // The ship's matrix is written straight from the three axes, so whatever goes in shows.
  const craft = ship(COLORS.yellow);
  craft.matrixAutoUpdate = false;
  const arrows = COLUMN_COLORS.map((color) => arrow(color));
  scene.add(rail, railTag, craft, ...arrows);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const worldUp = new THREE.Vector3(0, 1, 0);
  const forward = new THREE.Vector3();
  const side = new THREE.Vector3();
  const up = new THREE.Vector3();
  let remakeUp = true;
  let heading = 30;
  let slope = 30;

  const update = () => {
    const h = THREE.MathUtils.degToRad(heading);
    const s = THREE.MathUtils.degToRad(slope);
    forward.set(Math.sin(h) * Math.cos(s), Math.sin(s), Math.cos(h) * Math.cos(s));
    side.crossVectors(worldUp, forward).normalize();
    if (remakeUp) up.crossVectors(forward, side);
    else up.copy(worldUp);
    craft.matrix.makeBasis(side, up, forward).setPosition(center);
    craft.matrixWorldNeedsUpdate = true;

    setLine(rail, center.clone().addScaledVector(forward, -2.2), center.clone().addScaledVector(forward, 2.2));
    railTag.position.copy(center).addScaledVector(forward, -2.4); // the far end, away from the camera
    [side, up, forward].forEach((axis, i) => setArrow(arrows[i], center, axis.clone().multiplyScalar(0.9)));

    const square = THREE.MathUtils.radToDeg(up.angleTo(forward));
    const skewed = Math.abs(square - 90) > 0.5;
    readout.innerHTML = [
      `m.makeBasis(side, up, forward)   // up = ${remakeUp ? 'forward × side' : 'worldUp'}`,
      `<span style="color:${COLORS.green}">up</span> to <span style="color:${COLORS.blue}">forward</span>: ${formatNumber(square, 0)}°`,
      skewed ? `<span style="color:${COLORS.orange}">not at right angles, so the ship comes out skewed</span>` : 'at right angles: a clean turn',
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>up = forward × side</code>',
      select: () => {
        remakeUp = true;
        update();
      },
    },
    {
      html: '<code>up = worldUp</code>',
      select: () => {
        remakeUp = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Heading', { min: -90, max: 90, step: 15, value: heading }, (value) => {
    heading = value;
    update();
  });
  slider(controlsBar, 'Slope', { min: 0, max: 60, step: 10, value: slope }, (value) => {
    slope = value;
    update();
  });
};
