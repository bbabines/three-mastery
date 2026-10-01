import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { localHit } from './drill';

export const hit: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1, 2.5, 5);
  controls.target.set(0, 0.5, 0);
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  part.position.set(1, 0.6, 0);
  part.scale.set(1.5, 1, 0.7);
  const clickedLocal = new THREE.Vector3(0.5, 0.1, 0.4);
  const green = ball(COLORS.green, 0.5, 0.13);
  const orange = ball(COLORS.orange, 1, 0.09);
  scene.add(part, green, orange);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (degrees: number) => {
    part.rotation.y = THREE.MathUtils.degToRad(degrees);
    const worldHit = part.localToWorld(clickedLocal.clone());
    green.position.copy(worldHit);
    const result = attempt('localHit', () => localHit(part, worldHit.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    const reconstructed = part.localToWorld(result.value.clone());
    orange.position.copy(reconstructed);
    readout.textContent = `reconstructed click gap: ${reconstructed.distanceTo(worldHit).toFixed(2)}\n${reconstructed.distanceTo(worldHit) < 1e-3 ? 'markers overlap' : 'markers separate'}`;
  };
  slider(controlsBar, 'part turn', { min: -90, max: 90, step: 5, value: 40 }, update);
  update(40);
};
