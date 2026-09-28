// Scenes for the point vs direction page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatVector, label, LABEL_LIFT, line, overlay, pointer, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const axes: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4.5, 4.5, 8.5);
  controls.target.set(0, 1, 0);

  const directions: [THREE.Vector3, string, string][] = [
    [new THREE.Vector3(1, 0, 0), COLORS.red, 'X  right'],
    [new THREE.Vector3(0, 1, 0), COLORS.green, 'Y  up'],
    [new THREE.Vector3(0, 0, 1), COLORS.blue, 'Z  toward you'],
  ];
  for (const [axis, color, text] of directions) {
    const helper = arrow(color);
    setArrow(helper, new THREE.Vector3(), axis.clone().multiplyScalar(3));
    const tag = label(text, color);
    tag.position.copy(axis).multiplyScalar(3.6);
    scene.add(helper, tag);
  }
  const originTag = label('origin (0, 0, 0)', COLORS.gray);
  originTag.position.set(-0.9, -0.3, 0.3);
  scene.add(originTag);

  const marker = ball(COLORS.yellow);
  const drop = line(COLORS.yellow, 0.4); // a faint line to the floor makes the height readable
  scene.add(marker, drop);

  const code = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { x: 2, y: 1, z: 0 };

  const update = () => {
    marker.position.set(values.x, values.y, values.z);
    setLine(drop, marker.position, new THREE.Vector3(values.x, 0, values.z));
    code.textContent = `ball.position.set(${values.x}, ${values.y}, ${values.z})`;
  };
  for (const axis of ['x', 'y', 'z'] as const) {
    slider(sliders, axis.toUpperCase(), { min: -3, max: 3, step: 0.5, value: values[axis] }, (value) => {
      values[axis] = value;
      update();
    });
  }
  update();
};

const STARTS = [
  new THREE.Vector3(-3, 0, 1),
  new THREE.Vector3(-1, 1, -2),
  new THREE.Vector3(-2, 0, 2),
  new THREE.Vector3(-3, 2, -1),
];
const MOVE = new THREE.Vector3(3, 1, 0);
const SECONDS_PER_START = 2.5;

export const move: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0.5, 3.5, 6);
  controls.target.set(-0.5, 0.8, 0);

  const start = ball(COLORS.yellow);
  const end = ball(COLORS.orange, 0.7);
  const moveArrow = arrow(COLORS.green);
  const moveTag = label('move (3, 1, 0)', COLORS.green);
  scene.add(start, end, moveArrow, moveTag);

  const readout = overlay(container, 'readout');

  onFrame((_, elapsed) => {
    const step = elapsed / SECONDS_PER_START;
    const from = STARTS[Math.floor(step) % STARTS.length];
    const to = STARTS[(Math.floor(step) + 1) % STARTS.length];
    start.position.lerpVectors(from, to, THREE.MathUtils.smootherstep(step % 1, 0.6, 1));

    setArrow(moveArrow, start.position, MOVE);
    end.position.copy(start.position).add(MOVE);
    moveTag.position.copy(start.position).addScaledVector(MOVE, 0.5).add(LABEL_LIFT);

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">●</span> start      ${formatVector(start.position)}   changes`,
      `<span style="color:${COLORS.green}">→</span> move       ${formatVector(MOVE)}   always the same`,
      `<span style="color:${COLORS.orange}">●</span> end up at  ${formatVector(end.position)}   changes`,
    ].join('\n');
  });
};

export const lookAt: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 3.5, 4);
  controls.target.set(1.5, 0.3, -1.5);

  // Raised off the floor grid so the aim line stays visible.
  const turretPosition = new THREE.Vector3(3, 0.5, 0);
  const targetPosition = new THREE.Vector3(3, 0.5, -3);
  const dir = targetPosition.clone().sub(turretPosition); // (0, 0, -3)

  const target = ball(COLORS.red);
  target.position.copy(targetPosition);
  const targetTag = label('target', COLORS.red);
  targetTag.position.copy(targetPosition).add(LABEL_LIFT);

  const turret = pointer(COLORS.yellow);
  turret.position.copy(turretPosition);
  const turretTag = label('turret', COLORS.yellow);
  turretTag.position.copy(turretPosition).add(LABEL_LIFT);

  const wrongSpot = ball(COLORS.gray, 0.6);
  wrongSpot.position.copy(dir);
  const wrongTag = label('spot (0, 0, −3)', COLORS.gray);
  wrongTag.position.copy(dir).add(LABEL_LIFT);

  const aimLine = line(COLORS.yellow);
  scene.add(target, targetTag, turret, turretTag, wrongSpot, wrongTag, aimLine);

  const status = overlay(container, 'readout');
  const aim = (point: THREE.Vector3, hits: boolean) => {
    turret.lookAt(point);
    setLine(aimLine, turretPosition, point);
    wrongSpot.visible = wrongTag.visible = !hits;
    status.textContent = hits ? 'Facing the target.' : 'Misses: facing the spot (0, 0, −3), not the target.';
  };
  choiceButtons(overlay(container, 'controls'), [
    { html: '<code>turret.lookAt(target.position)</code>', select: () => aim(targetPosition, true) },
    { html: '<code>turret.lookAt(dir)</code>', select: () => aim(dir, false) },
  ]);
};
