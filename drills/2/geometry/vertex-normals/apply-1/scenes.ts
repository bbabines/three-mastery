import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { hardEdges } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6); controls.target.set(0, 0.9, 0);
  const geometry = new THREE.SphereGeometry(0.9, 7, 5);
  const referenceGeometry = geometry.toNonIndexed(); referenceGeometry.computeVertexNormals();
  const reference = new THREE.Mesh(referenceGeometry, new THREE.MeshStandardMaterial({ color: COLORS.green, flatShading: false }));
  reference.position.set(0, 1, 0); scene.add(reference);
  const show = comparison(container, 'Independent corners make hard edges');
  const result = attempt('hardEdges', () => hardEdges(geometry));
  if (result.ok) {
    const yours = new THREE.Mesh(result.value, new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    yours.position.set(-2, 1, 0); scene.add(yours);
  }
  show('blue learner · green reference',
    result.ok ? `${result.value.getAttribute('position').count} corners · ${result.value.index ? 'indexed' : 'nonindexed'}` : result.note,
    `${referenceGeometry.getAttribute('position').count} corners · nonindexed`);
};
