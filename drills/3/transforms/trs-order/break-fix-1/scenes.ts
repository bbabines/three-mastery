import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { posePreview } from './drill';

export const pose: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 2.5, 5);
  controls.target.set(0, 0, 0);
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  part.position.set(0.2, 0.2, 0);
  part.scale.set(2, 1, 0.5);
  const point = new THREE.Vector3(0.5, 0.25, 0.35);
  const marker = ball(COLORS.orange, 1, 0.1);
  const reference = ball(COLORS.green, 0.5, 0.14);
  scene.add(part, marker, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (degrees: number) => {
    part.rotation.y = THREE.MathUtils.degToRad(degrees);
    const expected = part.localToWorld(point.clone());
    reference.position.copy(expected);
    const result = attempt('posePreview', () => posePreview(part.position.clone(), part.quaternion.clone(), part.scale.clone(), point.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    marker.position.copy(result.value.worldPoint);
    readout.textContent = `marker gap: ${result.value.worldPoint.distanceTo(expected).toFixed(2)} world units\nrecovered scale x: ${result.value.recoveredScale.x.toFixed(2)}\n${result.value.worldPoint.distanceTo(expected) < 1e-3 ? 'markers overlap' : 'markers separate'}`;
  };
  slider(controlsBar, 'part turn', { min: -90, max: 90, step: 5, value: 50 }, update);
  update(50);
};
