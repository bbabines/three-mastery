import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { deformAndBound } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 3.5, 6);
  controls.target.set(1, 1, 0);
  const part = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.gray, side: THREE.DoubleSide }));
  part.position.y = 1;
  part.frustumCulled = false;
  const moved = ball(COLORS.yellow, 1, 0.13);
  const sphere = (color: string) => new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 12),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.6, depthTest: false }),
  );
  const yours = sphere(COLORS.blue);
  const reference = sphere(COLORS.green);
  scene.add(part, moved, yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (x: number) => {
    part.geometry.dispose();
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    geometry.computeBoundingSphere();
    const point = new THREE.Vector3(x, 0.4, 0.4);
    const result = attempt('deformAndBound', () => deformAndBound(geometry, 0, point.clone()));
    part.geometry = geometry;
    moved.position.copy(point).add(part.position);
    const fresh = geometry.clone();
    fresh.computeBoundingSphere();
    const expected = fresh.boundingSphere!;
    fresh.dispose();
    reference.position.copy(expected.center).add(part.position);
    reference.scale.setScalar(expected.radius);
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.position.copy(result.value.center).add(part.position);
    yours.scale.setScalar(result.value.radius);
    readout.textContent = `moved vertex x ${x.toFixed(1)} · yellow target\nyour sphere contains it: ${result.value.containsPoint(point)} · reference: true`;
  };
  slider(controlsBar, 'vertex x', { min: 1, max: 3, step: 0.25, value: 2.5 }, update);
  update(2.5);
};
