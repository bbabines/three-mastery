// Scenes for the points vs directions page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, overlay, pointer, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Where the hose connects and which way it points, both measured from the machine itself.
const HOSE_SPOT = new THREE.Vector3(0.6, 0.2, 0);
const HOSE_AIM = new THREE.Vector3(1, 0, 0);

export const moveTurnResize: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 2.9, 5.8);
  controls.target.set(0.2, 1, 0);

  const machine = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  const machineTag = label('machine', COLORS.blue);
  const spotBall = ball(COLORS.yellow, 1, 0.09);
  const spotTag = label('spot', COLORS.yellow);
  const aimArrow = arrow(COLORS.green);
  const aimTag = label('aim', COLORS.green);
  scene.add(machine, machineTag, spotBall, spotTag, aimArrow, aimTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { x: -0.5, turn: 0, size: 1 };

  const update = () => {
    machine.position.set(values.x, 1.1, 0);
    machine.rotation.y = THREE.MathUtils.degToRad(values.turn);
    machine.scale.setScalar(values.size);
    machine.updateMatrixWorld(); // the scene reads matrixWorld before the next render refreshes it

    const spot = HOSE_SPOT.clone().applyMatrix4(machine.matrixWorld);
    const aim = HOSE_AIM.clone().transformDirection(machine.matrixWorld);
    spotBall.position.copy(spot);
    setArrow(aimArrow, spot, aim);
    machineTag.position.set(values.x, 1.1 - 0.4 * values.size - 0.25, 0); // below, clear of the spot's label
    spotTag.position.copy(spot).add(LABEL_LIFT);
    aimTag.position.copy(spot).add(aim).addScaledVector(LABEL_LIFT, 0.6);

    readout.innerHTML = [
      `spot ${formatVector(HOSE_SPOT)} and aim ${formatVector(HOSE_AIM)}, measured from the machine itself`,
      `<span style="color:${COLORS.yellow}">●</span> spot.clone().applyMatrix4(machine.matrixWorld)`,
      `    ${formatVector(spot).padEnd(16)} a place: moves, turns, and resizes`,
      `<span style="color:${COLORS.green}">→</span> aim.clone().transformDirection(machine.matrixWorld)`,
      `    ${formatVector(aim).padEnd(16)} a direction: only turns, length ${formatNumber(aim.length())}`,
    ].join('\n');
  };
  slider(sliders, 'Move', { min: -1.5, max: 1.5, step: 0.5, value: values.x }, (value) => {
    values.x = value;
    update();
  });
  slider(sliders, 'Turn', { min: -180, max: 180, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(sliders, 'Size', { min: 0.5, max: 1.5, step: 0.25, value: values.size }, (value) => {
    values.size = value;
    update();
  });
  update();
};

// 2 units a second straight ahead, measured from the boat itself.
const BOAT_VELOCITY = new THREE.Vector3(0, 0, 2);

type Method = 'applyMatrix4' | 'transformDirection' | 'applyQuaternion';

const METHOD_TEXT: Record<Method, { code: string; verdict: string }> = {
  applyMatrix4: {
    code: 'velocity.clone().applyMatrix4(boat.matrixWorld)',
    verdict: "Bug: the boat's position got added, so it heads off course.",
  },
  transformDirection: {
    code: 'velocity.clone().transformDirection(boat.matrixWorld)',
    verdict: 'Turns the right way, but the speed drops to 1.',
  },
  applyQuaternion: {
    code: 'velocity.clone().applyQuaternion(boat.getWorldQuaternion(q))',
    verdict: 'Right for a velocity: turns with the boat and keeps its speed.',
  },
};

export const velocity: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 4, 5.4);
  controls.target.set(0, 0.4, 0.5);

  const boat = pointer(COLORS.yellow);
  const boatTag = label('boat', COLORS.yellow);
  const velocityArrow = arrow(COLORS.green);
  // Where the velocity should point: the way the boat faces, at full speed. The green arrow is compared against it.
  const facingArrow = arrow(COLORS.gray);
  scene.add(boat, boatTag, facingArrow, velocityArrow);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const q = new THREE.Quaternion();
  let method: Method = 'applyMatrix4';
  // Starts where the applyMatrix4 bug is plain: the arrow doesn't line up with the boat.
  let boatX = -1.5;
  let turn = 45;

  const update = () => {
    boat.position.set(boatX, 0.4, 0);
    boat.rotation.y = THREE.MathUtils.degToRad(turn);
    boat.updateMatrixWorld(); // applyMatrix4 and transformDirection read the saved matrixWorld
    boatTag.position.copy(boat.position).add(LABEL_LIFT);

    const result = BOAT_VELOCITY.clone();
    if (method === 'applyMatrix4') result.applyMatrix4(boat.matrixWorld);
    if (method === 'transformDirection') result.transformDirection(boat.matrixWorld);
    if (method === 'applyQuaternion') result.applyQuaternion(boat.getWorldQuaternion(q));
    setArrow(velocityArrow, boat.position, result);
    setArrow(facingArrow, boat.position, BOAT_VELOCITY.clone().applyQuaternion(boat.getWorldQuaternion(q)));

    readout.innerHTML = [
      `velocity ${formatVector(BOAT_VELOCITY)}: 2 units a second forward, measured from the boat`,
      `<span style="color:${COLORS.green}">→</span> ${METHOD_TEXT[method].code}`,
      `    ${formatVector(result).padEnd(16)} length ${formatNumber(result.length())}`,
      METHOD_TEXT[method].verdict,
      `<span style="color:${COLORS.gray}">→</span> gray: the way the boat faces, at speed 2`,
    ].join('\n');
  };

  const choose = (next: Method) => () => {
    method = next;
    update();
  };
  choiceButtons(controlsBar, [
    { html: '<code>applyMatrix4</code>', select: choose('applyMatrix4') },
    { html: '<code>transformDirection</code>', select: choose('transformDirection') },
    { html: '<code>applyQuaternion</code>', select: choose('applyQuaternion') },
  ]);
  slider(controlsBar, 'Move boat', { min: -1.5, max: 1.5, step: 0.5, value: boatX }, (value) => {
    boatX = value;
    update();
  });
  slider(controlsBar, 'Turn boat', { min: -180, max: 180, step: 15, value: turn }, (value) => {
    turn = value;
    update();
  });
};
