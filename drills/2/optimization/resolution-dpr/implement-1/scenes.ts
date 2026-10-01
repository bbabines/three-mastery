import { attempt, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pixelRatioFor } from './drill';

export const pixelBudget: SceneSetup = ({ scene, renderer, container, camera, controls, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  mesh.position.y = 0.8;
  scene.add(mesh);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { device: 2.5, cap: 2 };
  onFrame((delta) => {
    mesh.rotation.y += delta * 0.3;
    const result = attempt('pixelRatioFor', () => pixelRatioFor(values.device, values.cap));
    if (!result.ok) { readout.textContent = result.note; return; }
    if (renderer.getPixelRatio() !== result.value) renderer.setPixelRatio(result.value);
    const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
    readout.textContent = `chosen DPR ${formatNumber(result.value, 2)}\nbuffer ${buffer.x} × ${buffer.y} = ${(buffer.x * buffer.y).toLocaleString()} pixels`;
  });
  slider(bar, 'device DPR', { min: 1, max: 4, step: 0.25, value: values.device }, (value) => { values.device = value; });
  slider(bar, 'cap', { min: 1, max: 3, step: 0.25, value: values.cap }, (value) => { values.cap = value; });
};
