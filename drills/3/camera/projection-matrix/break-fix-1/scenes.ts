import { attempt, cameraView, choiceButtons, COLORS, overlay, showCamera } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { viewportLens } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(6, 4, 7);
  controls.target.set(0, 1, 0);
  const product = new THREE.Mesh(new THREE.BoxGeometry(1, 1.6, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  product.position.y = 1;
  scene.add(product);
  const eye = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
  eye.position.set(0, 1, 5);
  eye.lookAt(0, 1, 0);
  const helper = showCamera(eye);
  scene.add(eye, helper);
  const picture = cameraView(harness, eye, [helper]);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (width: number, height: number) => {
    const result = attempt('viewportLens', () => viewportLens(60, width, height, 0.1, 20));
    if (!result.ok) { readout.textContent = result.note; return; }
    const expected = new THREE.PerspectiveCamera(60, width / height, 0.1, 20).projectionMatrix;
    eye.aspect = width / height;
    eye.projectionMatrix.copy(result.value);
    eye.projectionMatrixInverse.copy(result.value).invert();
    eye.updateWorldMatrix(true, false);
    helper.update();
    picture.setSize(width, height);
    readout.textContent = `${width} × ${height} · picture uses your projection\nyour horizontal scale ${result.value.elements[0].toFixed(2)} · reference ${expected.elements[0].toFixed(2)}`;
  };
  choiceButtons(controlsBar, [
    { html: 'wide', select: () => update(480, 240) },
    { html: 'tall', select: () => update(240, 480) },
  ]);
};
