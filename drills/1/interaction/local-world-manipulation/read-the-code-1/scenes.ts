// Scenes for the local vs world manipulation page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export const gizmoSpace: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(1.1, 2.3, 3.1);
  controls.target.set(0.2, 0.45, -0.25);

  // A rail set at 35° to the world's X, and a carriage lined up with it.
  const ANGLE = THREE.MathUtils.degToRad(35);
  const railDirection = new THREE.Vector3(Math.cos(ANGLE), 0, -Math.sin(ANGLE));
  const railStart = railDirection.clone().multiplyScalar(-2.6).setY(0.35);
  const railEnd = railDirection.clone().multiplyScalar(2.6).setY(0.35);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  rail.position.set(0, 0.32, 0);
  rail.rotation.y = ANGLE;
  const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.4), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  const START = railDirection.clone().multiplyScalar(-0.8).setY(0.5);
  carriage.position.copy(START);
  carriage.rotation.y = ANGLE;
  scene.add(rail, carriage);

  const gizmo = new TransformControls(camera, renderer.domElement);
  gizmo.attach(carriage);
  gizmo.setSize(0.8);
  scene.add(gizmo.getHelper());
  gizmo.addEventListener('dragging-changed', (event) => (controls.enabled = !event.value));

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const railLine = new THREE.Line3(railStart, railEnd);
  const onRail = new THREE.Vector3();
  const ownX = new THREE.Vector3();
  const q = new THREE.Quaternion();
  let distance = 0;

  const show = () => {
    railLine.closestPointToPoint(carriage.position, false, onRail);
    const off = Math.hypot(carriage.position.x - onRail.x, carriage.position.z - onRail.z);
    const local = gizmo.space === 'local';
    readout.textContent = [
      `gizmo.setSpace('${gizmo.space}')   // its X arrow: ${local ? "the carriage's own X" : "the world's X"}`,
      local ? `carriage.position = start + ownX × ${formatNumber(distance)}` : `carriage.position.x = start.x + ${formatNumber(distance)}`,
      `carriage.position ${formatVector(carriage.position, 2)}`,
      off < 0.01 ? 'On the rail.' : `Off the rail by ${formatNumber(off)}.`,
    ].join('\n');
  };

  // The slider does what dragging the gizmo's X arrow does in the chosen space.
  const slide = () => {
    carriage.position.copy(START);
    if (gizmo.space === 'local') {
      ownX.set(1, 0, 0).applyQuaternion(carriage.getWorldQuaternion(q));
      carriage.position.addScaledVector(ownX, distance);
    } else {
      carriage.position.x += distance;
    }
    show();
  };
  gizmo.addEventListener('objectChange', show);

  choiceButtons(bar, [
    { html: "<code>gizmo.setSpace('world')</code>", select: () => (gizmo.setSpace('world'), slide()) },
    { html: "<code>gizmo.setSpace('local')</code>", select: () => (gizmo.setSpace('local'), slide()) },
  ]);
  slider(bar, 'Slide along X', { min: -1, max: 2, step: 0.25, value: distance }, (value) => {
    distance = value;
    slide();
  });
};

export const turnKnob: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 2.4, 3.2);
  controls.target.set(0, 0.9, 0);

  // A control panel tilted 40° toward the camera, and a knob sitting flush on it. Both are in the scene.
  const TILT = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(40));
  const panel = new THREE.Mesh(new THREE.BoxGeometry(2, 0.08, 1.2), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  panel.position.set(0, 0.8, 0);
  panel.quaternion.copy(TILT);
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 0.3), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  legs.position.set(0, 0.36, 0);
  scene.add(panel, legs);

  const knob = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.16, 32), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  body.position.y = 0.08;
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.2), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  notch.position.set(0, 0.17, 0.1); // shows which way the knob points
  knob.add(body, notch);
  const surfaceNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(TILT);
  knob.position.copy(panel.position).addScaledVector(surfaceNormal, 0.04);
  scene.add(knob);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const worldUp = new THREE.Vector3(0, 1, 0);
  const knobUp = new THREE.Vector3();
  let own = true;
  let degrees = 90;

  const update = () => {
    const angle = THREE.MathUtils.degToRad(degrees);
    knob.quaternion.copy(TILT); // flush with the panel
    if (own) knob.rotateY(angle);
    else knob.rotateOnWorldAxis(worldUp, angle);
    knobUp.set(0, 1, 0).applyQuaternion(knob.quaternion);
    const tipped = THREE.MathUtils.radToDeg(knobUp.angleTo(surfaceNormal));
    readout.textContent = [
      own ? `knob.rotateY(${formatNumber(angle)})   // around its own Y` : `knob.rotateOnWorldAxis(worldUp, ${formatNumber(angle)})`,
      `knob's own Y, in the world ${formatVector(knobUp, 2)}`,
      `the panel's up             ${formatVector(surfaceNormal, 2)}`,
      tipped < 0.5 ? 'Flush with the panel: it spins in place.' : `Tipped ${formatNumber(tipped, 0)}° off the panel.`,
    ].join('\n');
  };

  choiceButtons(bar, [
    { html: '<code>knob.rotateY(a)</code>', select: () => ((own = true), update()) },
    { html: '<code>knob.rotateOnWorldAxis(worldUp, a)</code>', select: () => ((own = false), update()) },
  ]);
  slider(bar, 'Turn a', { min: 0, max: 180, step: 15, value: degrees }, (value) => {
    degrees = value;
    update();
  });
};
