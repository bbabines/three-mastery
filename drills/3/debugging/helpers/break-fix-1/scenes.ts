import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Group, Vector3 } from 'three';
import { worldArrow } from './drill';

export const rayHelper: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 4, 6);
  controls.target.set(0, 0.5, 0);
  const parent = new Group(); parent.position.set(2, 0, -1); parent.rotation.y = 0.6; scene.add(parent);
  const origin = new Vector3(-1, 1, 1);
  const target = ball(COLORS.red, 1, 0.14); target.position.copy(origin); scene.add(target);
  const result = attempt('worldArrow', () => worldArrow(parent, origin.clone(), new Vector3(1, 0, -1)));
  parent.updateMatrixWorld(true);
  overlay(container, 'readout').textContent = result.ok
    ? `red dot: world ray origin\narrow miss: ${result.value.getWorldPosition(new Vector3()).distanceTo(origin).toFixed(2)}`
    : result.note;
};
