import { attempt, COLORS, label, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { flatNormals } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.5, 3.2, 5.5);
  controls.target.set(0, 1, 0);
  sunlight(scene, new THREE.Vector3(3, 5, 4));
  const source = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 5, 1);
  const result = attempt('flatNormals', () => flatNormals(source));
  const reference = source.toNonIndexed();
  reference.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: COLORS.blue, roughness: 0.8, side: THREE.DoubleSide });
  const makePart = (geometry: THREE.BufferGeometry, x: number, text: string) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, 1, 0);
    const tag = label(text, COLORS.yellow);
    tag.position.set(x, 2.1, 0);
    scene.add(mesh, tag);
  };
  if (result.ok) makePart(result.value, -1.2, 'yours');
  makePart(reference, 1.2, 'reference');
  const readout = overlay(container, 'readout');
  readout.textContent = result.ok
    ? `left: your normals · right: flat reference\nyour indexed: ${result.value.index !== null} (goal: false)`
    : result.note;
};
