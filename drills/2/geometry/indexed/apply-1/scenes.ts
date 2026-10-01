import { attempt, COLORS, line, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { separateFaces } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2, 2.5, 5); controls.target.set(0, 0.7, 0);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.green, side: THREE.DoubleSide, wireframe: true }));
  mesh.position.y = 0.8; scene.add(mesh);
  const show = comparison(container, 'Shared corners → separate face corners');
  const result = attempt('separateFaces', () => separateFaces(geometry));
  show('two triangles · four shared vertices',
    result.ok ? `${result.value.getAttribute('position').count} corner entries · ${result.value.index ? 'indexed' : 'nonindexed'}` : result.note,
    `${geometry.index!.count} corner entries · nonindexed`);
};
