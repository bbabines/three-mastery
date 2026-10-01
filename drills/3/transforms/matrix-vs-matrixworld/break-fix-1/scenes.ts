import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { moveWithoutJump } from './drill';

export const pickup: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 3, 6);
  controls.target.set(0, 0.5, 0);
  const oldParent = new THREE.Group();
  oldParent.position.set(-1, 0.5, 0);
  const newParent = new THREE.Group();
  const target = ball(COLORS.green, 0.4, 0.18);
  scene.add(oldParent, newParent, target);
  let part: THREE.Mesh | undefined;
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (x: number) => {
    if (part) part.parent?.remove(part);
    part = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
    part.position.set(0.7, 0.3, 0);
    oldParent.add(part);
    newParent.position.set(x, 0.2, 0.5);
    newParent.rotation.y = 0.5;
    const before = part.getWorldPosition(new THREE.Vector3());
    target.position.copy(before);
    const result = attempt('moveWithoutJump', () => moveWithoutJump(part!, newParent));
    readout.textContent = result.ok
      ? `jump: ${result.value.distanceTo(before).toFixed(2)} world units\n${result.value.distanceTo(before) < 1e-3 ? 'part stays on outline' : 'part leaves outline'}`
      : result.note;
  };
  slider(controlsBar, 'new group x', { min: -2, max: 2, step: 0.1, value: 1.5 }, update);
  update(1.5);
};
