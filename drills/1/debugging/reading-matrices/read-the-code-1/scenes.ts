// Scenes for the reading matrices page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatNumber, line, outline, overlay, setArrow, setLine, ship, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const columns: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.3, 2.2, 3.6);
  controls.target.set(0.2, 0.9, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 1, 2);

  // A gray ship with an orange ball on its +X wing tip, so a mirror shows.
  const part = ship(COLORS.gray);
  const tip = ball(COLORS.orange, 1, 0.07);
  tip.position.set(0.55, 0, -0.15);
  part.add(tip);
  const axisColors = [COLORS.red, COLORS.green, COLORS.blue];
  const axes = axisColors.map((color) => arrow(color));
  const move = line(COLORS.yellow); // from the origin to where the fourth column puts the ship
  scene.add(part, ...axes, move);

  const values = { x: 0.5, turn: 30, scale: 1 };
  const readout = overlay(container, 'readout');
  const column = new THREE.Vector3();
  const origin = new THREE.Vector3();

  const update = () => {
    part.position.set(values.x, 0.9, 0);
    part.rotation.y = THREE.MathUtils.degToRad(values.turn);
    part.scale.set(values.scale, 1, 1);
    part.updateMatrix();
    const e = part.matrix.elements;
    for (let i = 0; i < 3; i++) setArrow(axes[i], part.position, column.setFromMatrixColumn(part.matrix, i));
    setLine(move, origin, part.position);

    const determinant = part.matrix.determinant();
    const mirror = determinant < 0 ? 'mirrored' : determinant === 0 ? 'flat, no volume' : 'not mirrored';
    const lines = [0, 1, 2, 3].map((c) => {
      const numbers = [e[c * 4], e[c * 4 + 1], e[c * 4 + 2], e[c * 4 + 3]].map(f).join(', ');
      const range = `elements[${c * 4}–${c * 4 + 3}]`.padEnd(17);
      const color = c < 3 ? axisColors[c] : COLORS.yellow;
      const meaning =
        c < 3
          ? `own +${'XYZ'[c]}, ${f(column.setFromMatrixColumn(part.matrix, c).length())} long`
          : `the move · determinant ${f(determinant)}: ${mirror}`;
      return `<span style="color:${color}">${range}(${numbers})</span>  ${meaning}`;
    });
    readout.innerHTML = lines.join('\n');
  };

  const sliders = overlay(container, 'controls');
  slider(sliders, 'move x', { min: -1.5, max: 1.5, step: 0.5, value: values.x }, (value) => ((values.x = value), update()));
  slider(sliders, 'turn', { min: -180, max: 180, step: 15, value: values.turn }, (value) => ((values.turn = value), update()));
  slider(sliders, 'scale x', { min: -2, max: 2, step: 0.5, value: values.scale }, (value) => ((values.scale = value), update()));
  update();
};

// The same 16 numbers, typed the three ways the page compares.
const TYPED = [1, 0, 0, 1, 0, 1, 0, 0.4, 0, 0, 1, -0.3, 0, 0, 0, 1];
const COLUMNS = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0.4, -0.3, 1];
const list = (numbers: number[]) => [0, 4, 8, 12].map((i) => numbers.slice(i, i + 4).map(f).join(', ')).join(',  ');

export const setOrder: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.1, 2.5, 3.7);
  controls.target.set(0.45, 0.65, -0.1);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 1, 2);

  // Raised off the floor, so the box stays clear of the grid wherever the matrix puts it.
  const stage = new THREE.Group();
  stage.position.y = 0.5;
  const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const box = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  box.matrixAutoUpdate = false;
  const target = outline(geometry, COLORS.white);
  target.position.set(1, 0.4, -0.3);
  stage.add(box, target);
  scene.add(stage);

  const readout = overlay(container, 'readout');
  const position = new THREE.Vector3();
  const ways = [
    { html: '<code>set(…)</code>, row by row', line: `box.matrix.set(${list(TYPED)})`, apply: () => box.matrix.set(...(TYPED as Parameters<THREE.Matrix4['set']>)) },
    { html: '<code>fromArray</code>, the same numbers', line: `box.matrix.fromArray([${list(TYPED)}])`, apply: () => box.matrix.fromArray(TYPED) },
    { html: '<code>fromArray</code>, column by column', line: `box.matrix.fromArray([${list(COLUMNS)}])`, apply: () => box.matrix.fromArray(COLUMNS) },
  ];
  choiceButtons(
    overlay(container, 'controls'),
    ways.map((way) => ({
      html: way.html,
      select: () => {
        way.apply();
        const e = box.matrix.elements;
        position.setFromMatrixPosition(box.matrix);
        const moved = position.distanceTo(target.position) < 1e-6;
        readout.textContent = [
          way.line,
          `elements  [${list(e)}]`,
          moved
            ? `elements[12–14]  (${f(e[12])}, ${f(e[13])}, ${f(e[14])}): on the outline`
            : `elements[12–14]  (${f(e[12])}, ${f(e[13])}, ${f(e[14])}): not moved, and the move in the bottom row warps it`,
        ].join('\n');
      },
    })),
  );
};
