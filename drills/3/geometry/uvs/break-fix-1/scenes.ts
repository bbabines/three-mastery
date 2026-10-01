import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { tileFirstFace } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2, 5); controls.target.set(0, 0.5, 0);
  const base = new THREE.PlaneGeometry(2, 2);
  const readout = overlay(container, 'readout');
  const result = attempt('tileFirstFace', () => tileFirstFace(base, new THREE.Vector2(1, 0)));
  if (!result.ok) { readout.textContent = result.note; return; }
  const materials = [
    new THREE.MeshBasicMaterial({ color: COLORS.red, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: COLORS.green, side: THREE.DoubleSide }),
  ];
  const mesh = new THREE.Mesh(result.value, materials);
  mesh.position.y = 1;
  scene.add(mesh);
  readout.textContent = `first face group count: ${result.value.groups[0]?.count ?? 0} (goal: 3)\ngreen: decal face; red: remaining face`;
};
