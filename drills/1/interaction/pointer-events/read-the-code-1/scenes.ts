// Scenes for the pointer events page. The README places each one with <div data-scene="name">.
import { ball, buttonGroup, choiceButtons, COLORS, formatNumber, overlay, pointerSpot, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const pixelRatio: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 4.6, 4.2);
  controls.target.set(0, 0, -0.6);
  controls.update();
  camera.updateMatrixWorld();

  // A few posts, so where the ball lands on the floor is easy to read.
  for (const [x, z] of [
    [-2.5, -2.5],
    [2.5, -2.5],
    [-2.5, 1.5],
    [2.5, 1.5],
  ]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
    post.position.set(x, 0.4, z);
    scene.add(post);
  }
  const RADIUS = 0.18;
  const marker = ball(COLORS.yellow, 1, RADIUS);
  scene.add(marker);

  const canvas = renderer.domElement;
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  let multiply = false;
  let ratio = 2;
  // The pointer's spot as a fraction of the canvas, so it stays put when the page scrolls.
  const spot = { across: 0.25, down: 0.3 };

  // Runs inside every render, after the camera has moved, so the ball never lags behind an orbit.
  scene.onBeforeRender = () => {
    const rect = canvas.getBoundingClientRect();
    const x = spot.across * rect.width; // event.clientX - rect.left
    const y = spot.down * rect.height; // event.clientY - rect.top
    const k = multiply ? ratio : 1;
    ndc.set(((x * k) / rect.width) * 2 - 1, -((y * k) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const got = raycaster.ray.intersectPlane(floor, hit);
    marker.visible = got !== null;
    if (got) {
      marker.position.copy(hit);
      marker.position.y = RADIUS;
      marker.updateMatrixWorld(); // the scene's matrices were refreshed before this ran
    }
    const where = !got ? 'nowhere: the ray misses the floor' : multiply && ratio !== 1 ? `${ratio} times as far from the corner` : 'under the pointer';
    readout.textContent = [
      multiply ? 'x = (event.clientX - rect.left) * devicePixelRatio / rect.width' : 'x = (event.clientX - rect.left) / rect.width',
      `pointer ${Math.round(x)}, ${Math.round(y)} CSS px from the canvas's corner   pixel ratio ${multiply ? ratio : '(not used)'}`,
      `ndc (${f(ndc.x)}, ${f(ndc.y)})   the ball lands ${where}`,
      `this screen's devicePixelRatio: ${f(window.devicePixelRatio)}`,
    ].join('\n');
  };

  choiceButtons(buttonGroup(bar), [
    { html: '<code>(clientX - rect.left) / rect.width</code>', select: () => (multiply = false) },
    { html: '<code>… * devicePixelRatio / rect.width</code>', select: () => (multiply = true) },
  ]);
  slider(bar, 'Pixel ratio', { min: 1, max: 3, step: 0.5, value: ratio }, (value) => (ratio = value));
  pointerSpot(
    container,
    canvas,
    bar,
    (event) => {
      const rect = canvas.getBoundingClientRect();
      spot.across = (event.clientX - rect.left) / rect.width;
      spot.down = (event.clientY - rect.top) / rect.height;
    },
    spot,
  );
};
