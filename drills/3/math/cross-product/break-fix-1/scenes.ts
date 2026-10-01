import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { signedSide } from './drill';

export const panel: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.7, 1.7, 3);
  controls.target.set(0, 0.2, 0);
  const a = new THREE.Vector3(-1, -0.5, 0);
  const b = new THREE.Vector3(1, -0.5, 0);
  const c = new THREE.Vector3(0, 1, 0);
  const geometry = new THREE.BufferGeometry().setFromPoints([a, b, c]);
  const face = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.green, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
  const probe = ball(COLORS.yellow, 1, 0.12);
  scene.add(face, probe);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (z: number) => {
    probe.position.set(0, 0.1, z);
    const actual = attempt('signedSide', () => signedSide(a.clone(), b.clone(), c.clone(), probe.position.clone()));
    const expected = new THREE.Triangle(a, b, c).getNormal(new THREE.Vector3()).dot(probe.position.clone().sub(a));
    readout.textContent = actual.ok
      ? `your signed distance: ${actual.value.toFixed(2)}\nfront side: ${expected > 0 ? 'yes' : 'no'}\n${Math.abs(actual.value - expected) < 1e-4 ? 'sign matches' : 'sign is reversed'}`
      : actual.note;
  };
  slider(controlsBar, 'probe depth', { min: -1.5, max: 1.5, step: 0.1, value: 0.8 }, update);
  update(0.8);
};
