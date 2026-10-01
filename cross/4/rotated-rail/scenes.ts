import { Object3D, Vector3 } from 'three';
import { attempt, arrow, COLORS, line, overlay, setArrow, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { railMotion } from './drill';

export const rail: SceneSetup = ({ scene, container, onFrame }) => {
  const holder = new Object3D();
  holder.rotation.y = 0.7;
  const axis = new Object3D();
  axis.rotation.z = 0.35;
  holder.add(axis);
  scene.add(holder);
  axis.updateWorldMatrix(true, false);
  const worldAxis = new Vector3(1, 0, 0).transformDirection(axis.matrixWorld);
  const railGuide = line(COLORS.yellow);
  setLine(railGuide, worldAxis.clone().multiplyScalar(-2), worldAxis.clone().multiplyScalar(2));
  scene.add(railGuide);
  const inputArrow = arrow(COLORS.blue);
  const outputArrow = arrow(COLORS.green);
  outputArrow.visible = false;
  scene.add(inputArrow, outputArrow);
  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    const motion = new Vector3(Math.sin(elapsed) * 2, 1, 1);
    setArrow(inputArrow, new Vector3(), motion);
    const result = attempt('rail motion', () => railMotion(motion.clone(), axis));
    if (result.ok) setArrow(outputArrow, new Vector3(), result.value);
    else outputArrow.visible = false;
    readout.textContent = result.ok ? 'Yellow: rail. Blue: pointer motion. Green: motion along rail.' : `Yellow: rail. Blue: pointer motion. ${result.note}`;
  });
};
