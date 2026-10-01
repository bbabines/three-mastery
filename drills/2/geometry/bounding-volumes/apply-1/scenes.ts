import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { freshBoundingSphere } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 4, 6); controls.target.set(0, 0.8, 0);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.yellow, wireframe: true }));
  mesh.position.y = 1; scene.add(mesh);
  const wire = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), new THREE.MeshBasicMaterial({ color: COLORS.green, wireframe: true }));
  scene.add(wire);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Fresh bounding sphere after vertex edit');
  let movedX = 2;
  const update = () => {
    geometry.getAttribute('position').setX(0, movedX);
    geometry.boundingSphere = null;
    geometry.computeBoundingSphere();
    const expected = geometry.boundingSphere!.clone();
    geometry.boundingSphere = null;
    const result = attempt('freshBoundingSphere', () => freshBoundingSphere(geometry));
    wire.position.copy(expected.center).add(mesh.position); wire.scale.setScalar(expected.radius);
    show(`vertex 0 x ${movedX.toFixed(1)}`,
      result.ok ? `center x ${result.value.center.x.toFixed(2)} · radius ${result.value.radius.toFixed(2)}` : result.note,
      `center x ${expected.center.x.toFixed(2)} · radius ${expected.radius.toFixed(2)}`);
  };
  slider(controlsBar, 'vertex x', { min: 1, max: 3, step: 0.5, value: movedX }, value => { movedX = value; update(); });
  update();
};
