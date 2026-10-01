import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { slideAndBounce } from './drill';

export const wall: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2, 2.4, 4);
  controls.target.set(0, 0, 0);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 1.8),
    new THREE.MeshBasicMaterial({ color: COLORS.gray, side: THREE.DoubleSide, transparent: true, opacity: 0.25 }),
  );
  const incomingArrow = arrow(COLORS.orange);
  const bounceArrow = arrow(COLORS.blue);
  const slideArrow = arrow(COLORS.green);
  const incoming = new THREE.Vector3(1, 0.2, -0.4);
  setArrow(incomingArrow, new THREE.Vector3(), incoming);
  scene.add(plane, incomingArrow, bounceArrow, slideArrow);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (degrees: number) => {
    plane.rotation.y = THREE.MathUtils.degToRad(degrees);
    const normal = new THREE.Vector3(0, 0, 1).applyEuler(plane.rotation).multiplyScalar(3);
    const result = attempt('slideAndBounce', () => slideAndBounce(incoming.clone(), normal.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(slideArrow, new THREE.Vector3(), result.value.slide);
    setArrow(bounceArrow, new THREE.Vector3(), result.value.bounce);
    readout.textContent = [
      `incoming length: ${incoming.length().toFixed(2)}`,
      `bounce length: ${result.value.bounce.length().toFixed(2)}`,
      Math.abs(incoming.length() - result.value.bounce.length()) < 1e-3 ? 'bounce keeps speed' : 'bounce changes speed',
    ].join('\n');
  };
  slider(controlsBar, 'wall angle', { min: 15, max: 75, step: 5, value: 45 }, update);
  update(45);
};
