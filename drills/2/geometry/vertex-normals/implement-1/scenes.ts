import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { smoothNormals } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6); controls.target.set(0, 0.9, 0);
  const geometry = new THREE.SphereGeometry(0.9, 8, 5);
  geometry.deleteAttribute('normal');
  const referenceGeometry = geometry.clone(); referenceGeometry.computeVertexNormals();
  const reference = new THREE.Mesh(referenceGeometry, new THREE.MeshStandardMaterial({ color: COLORS.green }));
  reference.position.set(0, 1, 0); scene.add(reference);
  const show = comparison(container, 'Rebuild smooth vertex normals');
  const result = attempt('smoothNormals', () => smoothNormals(geometry));
  if (result.ok) {
    const yours = new THREE.Mesh(result.value, new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    yours.position.set(-2, 1, 0); scene.add(yours);
  }
  show('blue learner · green reference',
    result.ok ? `${result.value.getAttribute('normal')?.count ?? 0} normals` : result.note,
    `${referenceGeometry.getAttribute('normal').count} normals`);
};
