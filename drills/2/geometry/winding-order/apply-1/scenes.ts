import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { reverseWinding } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 2.5, -5); controls.target.set(0, 0.8, 0);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0.4, 0, 1, 0.4, 0, 0, 1.7, 0], 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
  geometry.computeVertexNormals();
  const referenceGeometry = geometry.clone();
  const position = referenceGeometry.getAttribute('position');
  for (let component = 0; component < 3; component++) {
    const second = position.getComponent(1, component);
    position.setComponent(1, component, position.getComponent(2, component));
    position.setComponent(2, component, second);
  }
  referenceGeometry.computeVertexNormals();
  const reference = new THREE.Mesh(referenceGeometry, new THREE.MeshBasicMaterial({ color: COLORS.green, side: THREE.FrontSide }));
  reference.position.set(1.2, 0, 0); scene.add(reference);
  const show = comparison(container, 'Reverse triangle fronts');
  const result = attempt('reverseWinding', () => reverseWinding(geometry));
  if (result.ok) {
    const yours = new THREE.Mesh(result.value, new THREE.MeshBasicMaterial({ color: COLORS.blue, side: THREE.FrontSide }));
    yours.position.set(-1.2, 0, 0); scene.add(yours);
  }
  show('blue learner · green reference · front faces viewer after flip?',
    result.ok ? `index ${result.value.index ? 'yes' : 'no'} · first face reversed` : result.note,
    'first face reversed · UV stays with each corner');
};
