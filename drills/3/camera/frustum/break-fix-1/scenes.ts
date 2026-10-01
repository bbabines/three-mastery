import { attempt, ball, cameraView, choiceButtons, COLORS, overlay, showCamera } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { visibleAfterResize } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(7, 4, 8);
  controls.target.set(1, 1, 0);
  const center = new THREE.Vector3(0, 1, 0);
  const point = new THREE.Vector3(3, 1, 0);
  const middle = ball(COLORS.blue, 1, 0.4);
  const marker = ball(COLORS.yellow, 1, 0.2);
  middle.position.copy(center);
  marker.position.copy(point);
  scene.add(middle, marker);
  const eye = new THREE.PerspectiveCamera(60, 2, 0.1, 20);
  eye.position.set(0, 1, 5);
  eye.lookAt(center);
  const helper = showCamera(eye);
  scene.add(eye, helper);
  const picture = cameraView(harness, eye, [helper]);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (width: number, height: number) => {
    const result = attempt('visibleAfterResize', () => visibleAfterResize(eye, width, height, point.clone()));
    if (!result.ok) { readout.textContent = result.note; return; }
    const fresh = new THREE.PerspectiveCamera(60, width / height, 0.1, 20);
    fresh.position.copy(eye.position);
    fresh.lookAt(center);
    fresh.updateWorldMatrix(true, false);
    const ndc = point.clone().project(fresh);
    const expected = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && Math.abs(ndc.z) <= 1;
    helper.update();
    picture.setSize(Math.round(320 * width / height), 320);
    readout.textContent = `${width} × ${height} · yellow side marker\nyour visible: ${result.value} · reference: ${expected}`;
  };
  choiceButtons(controlsBar, [
    { html: 'tall', select: () => update(400, 800) },
    { html: 'wide', select: () => update(800, 400) },
  ]);
};
