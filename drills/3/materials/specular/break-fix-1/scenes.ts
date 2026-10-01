import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { glint } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  const sample = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.2), sample);
  panel.position.y = 0.6;
  scene.add(panel);
  const readout = overlay(container, 'readout');
  const update = (degrees: number) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    camera.position.set(3 * Math.sin(radians), 1.2, 3 * Math.cos(radians));
    controls.update();
    const view = new THREE.Vector3(Math.sin(radians), 0, Math.cos(radians));
    const result = attempt('glint', () => glint(
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1), view, 16,
    ));
    if (!result.ok) { readout.textContent = result.note; return; }
    sample.color.setScalar(result.value);
    readout.textContent = `View angle: ${degrees}°\nGlint strength: ${result.value.toFixed(3)}\nThe light and panel stay fixed.`;
  };
  slider(overlay(container, 'controls'), 'view angle', { min: 0, max: 60, step: 5, value: 0 }, update);
  update(0);
};
