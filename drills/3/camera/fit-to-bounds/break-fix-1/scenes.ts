import { attempt, ball, cameraView, choiceButtons, COLORS, overlay, showCamera } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { fitAndPixelSize } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(8, 6, 8);
  controls.target.set(0, 2, 1);
  const center = new THREE.Vector3(0, 2, 0);
  const sphere = ball(COLORS.blue, 1, 2);
  sphere.position.copy(center);
  scene.add(sphere);
  const eye = new THREE.PerspectiveCamera(60, 1, 0.1, 30);
  const helper = showCamera(eye);
  scene.add(eye, helper);
  const picture = cameraView(harness, eye, [helper]);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (aspect: number) => {
    const result = attempt('fitAndPixelSize', () => fitAndPixelSize(2, 60, aspect, 320));
    if (!result.ok) { readout.textContent = result.note; return; }
    const halfVertical = THREE.MathUtils.degToRad(30);
    const halfHorizontal = Math.atan(Math.tan(halfVertical) * aspect);
    const expected = 2 / Math.sin(Math.min(halfVertical, halfHorizontal));
    eye.aspect = aspect;
    eye.position.copy(center).add(new THREE.Vector3(0, 0, result.value.distance));
    eye.lookAt(center);
    eye.updateProjectionMatrix();
    eye.updateWorldMatrix(true, false);
    helper.update();
    picture.setSize(Math.round(320 * aspect), 320);
    readout.textContent = `aspect ${aspect.toFixed(1)} · your distance ${result.value.distance.toFixed(2)}\nfit distance ${expected.toFixed(2)} · one CSS pixel ${result.value.unitsPerPixel.toFixed(3)} world units`;
  };
  choiceButtons(controlsBar, [
    { html: 'tall', select: () => update(0.5) },
    { html: 'wide', select: () => update(2) },
  ]);
};
