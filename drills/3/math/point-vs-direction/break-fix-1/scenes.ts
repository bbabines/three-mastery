import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { nearestWithin } from './drill';

export const rack: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1, 3.2, 6);
  controls.target.set(1, 0.5, 0);
  const worker = ball(COLORS.blue, 1, 0.16);
  const locations = [new THREE.Vector3(2.2, 0.5, 0), new THREE.Vector3(0.1, 0.5, 0), new THREE.Vector3(2.6, 0.5, 0)];
  const parts = locations.map((location) => {
    const mesh = ball(COLORS.gray, 1, 0.1);
    mesh.position.copy(location);
    scene.add(mesh);
    return mesh;
  });
  scene.add(worker);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (x: number) => {
    const center = new THREE.Vector3(x, 0.5, 0);
    worker.position.copy(center);
    const expected = locations.map((point, index) => ({ index, d: point.distanceToSquared(center) }))
      .filter(({ d }) => d <= 0.5 ** 2).sort((a, b) => a.d - b.d)[0]?.index ?? -1;
    const result = attempt('nearestWithin', () => nearestWithin(center.clone(), locations.map((p) => p.clone()), 0.5));
    parts.forEach((part, index) => (part.material as THREE.MeshStandardMaterial).color.set(index === expected ? COLORS.green : COLORS.gray));
    readout.textContent = result.ok
      ? `worker picked part ${result.value < 0 ? 'none' : result.value + 1}\nnearest reachable part ${expected < 0 ? 'none' : expected + 1}\n${result.value === expected ? 'selection matches' : 'selection disagrees'}`
      : result.note;
  };
  slider(controlsBar, 'worker x', { min: -1, max: 3, step: 0.1, value: 2 }, update);
  update(2);
};
