import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { blendOrientation } from './drill';

export const blend: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.4, 4);
  controls.target.set(0, 0, 0);
  const yours = arrow(COLORS.orange), reference = arrow(COLORS.green);
  scene.add(yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const from = new THREE.Euler(0, THREE.MathUtils.degToRad(170), 0, 'YXZ');
  const to = new THREE.Euler(0, THREE.MathUtils.degToRad(-170), 0, 'YXZ');
  const update = (t: number) => {
    const expected = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion().setFromEuler(from), new THREE.Quaternion().setFromEuler(to), t);
    setArrow(reference, new THREE.Vector3(), new THREE.Vector3(0, 0, -1).applyQuaternion(expected));
    const result = attempt('blendOrientation', () => blendOrientation(from.clone(), to.clone(), t));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yours, new THREE.Vector3(), new THREE.Vector3(0, 0, -1).applyQuaternion(result.value));
    const error = THREE.MathUtils.radToDeg(result.value.angleTo(expected));
    readout.textContent = `orientation gap: ${error.toFixed(1)}°\n${error < 1e-3 ? 'orange follows green' : 'orange takes the long turn'}`;
  };
  slider(controlsBar, 'blend', { min: 0, max: 1, step: 0.05, value: 0.5 }, update);
  update(0.5);
};
