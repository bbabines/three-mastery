import { Object3D, Vector3 } from 'three';
import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { railMotion } from './drill';

export const rail: SceneSetup = ({ scene, container, onFrame }) => {
  const holder = new Object3D();
  holder.rotation.y = 0.7;
  const axis = new Object3D();
  axis.rotation.z = 0.35;
  holder.add(axis);
  scene.add(holder);
  const marker = ball(COLORS.green, 1, 0.2);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    const result = attempt('rail motion', () => railMotion(new Vector3(Math.sin(elapsed) * 2, 1, 1), axis));
    if (result.ok) marker.position.copy(result.value);
    readout.textContent = result.ok ? 'Green: motion kept along rotated rail' : result.note;
  });
};
