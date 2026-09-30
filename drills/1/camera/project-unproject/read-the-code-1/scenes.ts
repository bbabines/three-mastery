// Scenes for the project and unproject page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, label, LABEL_LIFT, overlay, pointerToNdc, screenTag, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const underCursor: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 2.4, 7);
  controls.target.set(0, 1, 0);

  // Posts at a few distances, so how far away the ball is reads at a glance.
  for (const [x, z] of [
    [-2.5, 2],
    [2.5, 0],
    [-1.5, -2],
    [1.5, -4],
  ]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
    post.position.set(x, 0.8, z);
    scene.add(post);
  }
  const marker = ball(COLORS.yellow, 1, 0.2);
  scene.add(marker);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const ndc = new THREE.Vector2(0.3, 0.1);
  canvas.addEventListener('pointermove', (event) => pointerToNdc(event, canvas, ndc));
  let distance = 6;

  // Runs inside every render, after three.js has refreshed the camera, so the ball never lags.
  scene.onBeforeRender = () => {
    const spot = new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(camera);
    const spotDistance = camera.position.distanceTo(spot);
    const dir = spot.sub(camera.position).normalize();
    marker.position.copy(camera.position).addScaledVector(dir, distance);
    marker.updateMatrixWorld(); // the scene's matrices were refreshed before this ran

    readout.innerHTML = [
      `ndc (${f(ndc.x)}, ${f(ndc.y)})   the pointer, from −1 to 1`,
      `spot = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera)`,
      `    ${formatNumber(spotDistance, 2)} from the camera: only a direction`,
      `ball.position = camera.position + dir × ${distance}`,
    ].join('\n');
  };

  slider(sliders, 'distance', { min: 2, max: 10, step: 1, value: distance }, (value) => (distance = value));
};

export const behind: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.8, 5);
  controls.target.set(0, 1.2, 0);

  const sign = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  post.position.y = 0.65;
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.05), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  board.position.y = 1.45;
  const anchor = new THREE.Object3D(); // the spot the label is pinned to: the top of the board
  anchor.position.y = 1.65;
  const signTag = label('sign', COLORS.blue);
  signTag.position.set(0, 1.45, 0).add(LABEL_LIFT);
  sign.add(post, board, anchor, signTag);
  scene.add(sign);
  const tag = screenTag(container, 'Rack 12', COLORS.yellow);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const spot = new THREE.Vector3();
  let checkZ = false;
  let z = 1;

  scene.onBeforeRender = () => {
    sign.position.set(1.2, 0, z);
    sign.updateMatrixWorld(); // the scene's matrices were refreshed before this ran

    const ndc = anchor.getWorldPosition(spot).project(camera);
    const inView = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1;
    const zOk = Math.abs(ndc.z) <= 1;
    tag.hidden = checkZ ? !(inView && zOk) : !inView;
    tag.style.left = `${((ndc.x + 1) / 2) * canvas.clientWidth}px`;
    tag.style.top = `${((1 - ndc.y) / 2) * canvas.clientHeight}px`;

    const where = ndc.z > 1 ? 'behind the camera: z is above 1' : ndc.z < -1 ? 'closer than near: z is below −1' : 'in front of the camera';
    readout.innerHTML = [
      checkZ ? 'label.hidden = |x| > 1 || |y| > 1 || |z| > 1' : 'label.hidden = |x| > 1 || |y| > 1',
      `ndc (${f(ndc.x)}, ${f(ndc.y)}, ${f(ndc.z)})   ${where}`,
      tag.hidden ? 'The label is hidden.' : ndc.z > 1 ? 'The label shows, mirrored: wrong.' : 'The label shows.',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'Check x and y',
      select: () => (checkZ = false),
    },
    {
      html: 'Check z too',
      select: () => (checkZ = true),
    },
  ]);
  slider(controlsBar, 'move sign', { min: -3, max: 9, step: 0.5, value: z }, (value) => (z = value));
};
