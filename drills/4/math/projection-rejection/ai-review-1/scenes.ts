import { attempt, arrow, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Vector3 } from 'three';
import { slideOnWall } from './drill';

export const wallSlide: SceneSetup = ({ scene, container, camera, controls, onFrame }) => {
  camera.position.set(3, 4, 6);
  controls.target.set(0, 0.3, 0);
  const input = arrow(COLORS.yellow);
  const output = arrow(COLORS.green);
  scene.add(input, output);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { x: 2.5, z: 1.5 };
  const normal = new Vector3(1, 0, -1);
  onFrame(() => {
    const velocity = new Vector3(values.x, 0, values.z);
    setArrow(input, new Vector3(-1.5, 0.3, 0), velocity);
    const result = attempt('slideOnWall', () => slideOnWall(velocity, normal.clone()));
    if (!result.ok) { readout.textContent = result.note; return; }
    setArrow(output, new Vector3(1.5, 0.3, 0), result.value);
    readout.textContent = `yellow: original velocity\ngreen: wall-parallel answer\ninput changed: ${velocity.distanceTo(new Vector3(values.x, 0, values.z)) > 1e-9 ? 'yes' : 'no'}`;
  });
  slider(bar, 'velocity x', { min: -4, max: 4, step: 0.25, value: values.x }, (value) => { values.x = value; });
  slider(bar, 'velocity z', { min: -4, max: 4, step: 0.25, value: values.z }, (value) => { values.z = value; });
};
