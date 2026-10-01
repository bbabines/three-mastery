import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { nextEmphasis } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 2.5, 6);
  controls.target.set(0, 0.5, 0);
  const shape = new THREE.BoxGeometry(0.9, 0.9, 0.9);
  const yours = new THREE.Mesh(shape, new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  const reference = new THREE.Mesh(shape, new THREE.MeshStandardMaterial({ color: COLORS.yellow, wireframe: true }));
  yours.position.y = reference.position.y = 0.7;
  scene.add(yours, reference);
  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    const dt = 0.12 + (Math.sin(elapsed) + 1) * 0.05;
    const result = attempt('nextEmphasis', () => nextEmphasis(false, true, 1, dt));
    if (!result.ok) { readout.textContent = result.note; return; }
    const expected = THREE.MathUtils.damp(1, 1.2, 12, dt);
    yours.scale.setScalar(result.value);
    reference.scale.setScalar(expected);
    readout.textContent = `selected part after hover ends
blue: your size; yellow wireframe: selected size
size gap: ${Math.abs(result.value - expected).toFixed(3)}`;
  });
};
