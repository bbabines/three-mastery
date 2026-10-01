import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldSurface } from './drill';

export const surface: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2, 2.5, 5);
  controls.target.set(0, 0.5, 0);
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 1), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  part.position.y = 0.5;
  part.scale.set(2, 1, 0.4);
  const localNormal = new THREE.Vector3(1, 0, 1).normalize();
  const yourArrow = arrow(COLORS.orange);
  const correctArrow = arrow(COLORS.green);
  scene.add(part, yourArrow, correctArrow);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (degrees: number) => {
    part.rotation.y = THREE.MathUtils.degToRad(degrees);
    part.updateWorldMatrix(true, false);
    const expected = localNormal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(part.matrixWorld));
    setArrow(correctArrow, part.position, expected);
    const result = attempt('worldSurface', () => worldSurface(part, localNormal.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yourArrow, part.position, result.value.normal);
    readout.textContent = `normal error: ${THREE.MathUtils.radToDeg(result.value.normal.angleTo(expected)).toFixed(1)}°\n${result.value.normal.angleTo(expected) < 1e-3 ? 'arrows align' : 'arrows disagree'}`;
  };
  slider(controlsBar, 'part turn', { min: -90, max: 90, step: 5, value: 45 }, update);
  update(45);
};
