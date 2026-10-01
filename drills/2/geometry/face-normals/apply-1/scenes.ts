import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { flatFaceToward } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.7, 0);
  const a = new THREE.Vector3(-1, 0.5, 0), b = new THREE.Vector3(1, 0.5, 0), c = new THREE.Vector3(0, 1.6, -0.5);
  const triangle = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([a, b, c]), new THREE.MeshBasicMaterial({ color: COLORS.green, side: THREE.DoubleSide, wireframe: true }));
  const normal = THREE.Triangle.getNormal(a, b, c, new THREE.Vector3());
  const indicator = arrow(COLORS.yellow);
  scene.add(triangle, indicator);
  setArrow(indicator, new THREE.Vector3(0, 0.9, -0.15), normal);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Geometric face versus viewer');
  let side = 1;
  const update = () => {
    const towardViewer = normal.clone().multiplyScalar(side);
    const result = attempt('flatFaceToward', () => flatFaceToward(a.clone(), b.clone(), c.clone(), towardViewer));
    show(`viewer on ${side > 0 ? 'front' : 'back'} side`,
      result.ok ? `face toward viewer: ${result.value}` : result.note,
      `face toward viewer: ${side > 0}`);
  };
  slider(controlsBar, 'viewer side', { min: -1, max: 1, step: 2, value: side }, value => { side = value; update(); });
  update();
};
