import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { orbitTurn } from './drill';

export const orbit: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 3.5, 5);
  controls.target.set(0, 0, 0);
  const targetArrow = arrow(COLORS.yellow);
  const yourArrow = arrow(COLORS.blue);
  scene.add(targetArrow, yourArrow);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const from = new THREE.Spherical(2, Math.PI / 2, 0);
  const update = (degrees: number) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    const to = new THREE.Spherical(2, Math.PI / 2, radians);
    setArrow(targetArrow, new THREE.Vector3(), new THREE.Vector3().setFromSpherical(to));
    const result = attempt('orbitTurn', () => orbitTurn(from.clone(), to.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yourArrow, new THREE.Vector3(), new THREE.Vector3().setFromSpherical(new THREE.Spherical(1.5, Math.PI / 2, result.value)));
    const miss = Math.abs(Math.atan2(Math.sin(result.value - radians), Math.cos(result.value - radians)));
    readout.textContent = `your turn: ${THREE.MathUtils.radToDeg(result.value).toFixed(0)}°\ntarget turn: ${degrees}°\n${miss < 1e-3 ? 'blue follows yellow' : 'blue turns the wrong way'}`;
  };
  slider(controlsBar, 'target turn', { min: -180, max: 180, step: 5, value: -60 }, update);
  update(-60);
};
