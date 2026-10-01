import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { vignetteRadius } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.6, 0);
  const viewport = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ color: '#34485d' }));
  viewport.position.y = 0.6;
  scene.add(viewport);
  const center = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.09), new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide }));
  center.position.set(0, 0.6, 0.02);
  scene.add(center);
  const sample = new THREE.Mesh(new THREE.SphereGeometry(0.055), new THREE.MeshBasicMaterial({ color: '#ffad73' }));
  scene.add(sample);
  const readout = overlay(container, 'readout');
  const update = (dpr: number) => {
    // A fixed device-pixel sample has a different CSS position at each DPR.
    sample.position.set(1.6 / dpr - 0.8, 1 - 0.8 / dpr, 0.06);
    const result = attempt('vignetteRadius', () => vignetteRadius(new THREE.Vector2(200, 100), new THREE.Vector2(200, 100), dpr));
    readout.textContent = result.ok
      ? `DPR: ${dpr}\nOrange sample's reported distance from white center: ${result.value.toFixed(3)}`
      : result.note;
  };
  slider(overlay(container, 'controls'), 'DPR', { min: 1, max: 2, step: 1, value: 2 }, update);
  update(2);
};
