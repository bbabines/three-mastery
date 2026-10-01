import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldNormal } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.6, 0);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshStandardMaterial({ color: '#7f9dbb', side: THREE.DoubleSide }));
  panel.position.y = 0.6;
  panel.rotation.set(-Math.PI / 2, 0, 0.5);
  scene.add(panel);
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.6, 0.1), 0.85, 0xffa46e);
  scene.add(arrow);
  const readout = overlay(container, 'readout');
  const update = (degrees: number) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    camera.position.set(0, 1.5 + 2 * Math.sin(radians), 3 * Math.cos(radians));
    controls.update();
    const view = new THREE.Matrix4().makeRotationX(radians);
    const result = attempt('worldNormal', () => worldNormal(new THREE.Vector3(0, 1, 0), new THREE.Matrix4().makeRotationZ(0.5), view));
    if (!result.ok) { readout.textContent = result.note; return; }
    arrow.setDirection(result.value.clone().normalize());
    readout.textContent = `Camera rotation: ${degrees}°\nReported world normal: ${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}, ${result.value.z.toFixed(2)}\nThe orange arrow should keep one world direction.`;
  };
  slider(overlay(container, 'controls'), 'camera rotation', { min: 0, max: 80, step: 10, value: 0 }, update);
  update(0);
};
