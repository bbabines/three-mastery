import { attempt, ball, COLORS, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { depthBufferValue } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.4, 6);
  controls.target.set(0, 1, 0);
  const axis = line(COLORS.gray);
  setLine(axis, new THREE.Vector3(-2, 1, 0), new THREE.Vector3(2, 1, 0));
  const yours = ball(COLORS.blue, 1, 0.18);
  const reference = ball(COLORS.green, 1, 0.18);
  scene.add(axis, yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const lens = new THREE.PerspectiveCamera(60, 1, 1, 100);

  const update = (depth: number) => {
    const result = attempt('depthBufferValue', () => depthBufferValue(1, 100, depth));
    const expected = (new THREE.Vector3(0, 0, -depth).applyMatrix4(lens.projectionMatrix).z + 1) / 2;
    reference.position.set(-2 + 4 * expected, 1.35, 0);
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.position.set(-2 + 4 * result.value, 0.7, 0);
    readout.textContent = `view depth ${depth} · blue: yours · green: reference\nyour depth ${result.value.toFixed(3)} · reference ${expected.toFixed(3)}`;
  };
  slider(controlsBar, 'view depth', { min: 1, max: 100, step: 1, value: 10 }, update);
  update(10);
};
