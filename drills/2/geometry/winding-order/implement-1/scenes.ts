import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { frontFacesViewer } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 2.5, 5); controls.target.set(0, 0.8, 0);
  const a = new THREE.Vector3(-1, 0.4, 0), b = new THREE.Vector3(1, 0.4, 0), c = new THREE.Vector3(0, 1.7, 0);
  const surface = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([a, b, c]), new THREE.MeshBasicMaterial({ color: COLORS.green, side: THREE.DoubleSide, wireframe: true }));
  const normal = THREE.Triangle.getNormal(a, b, c, new THREE.Vector3());
  const indicator = arrow(COLORS.yellow);
  scene.add(surface, indicator);
  setArrow(indicator, new THREE.Vector3(0, 0.8, 0), normal);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Corner order sets the front');
  let reversed = 0;
  const update = () => {
    const result = attempt('frontFacesViewer', () => frontFacesViewer(a.clone(), reversed ? c.clone() : b.clone(), reversed ? b.clone() : c.clone(), new THREE.Vector3(0, 0, 1)));
    show(`corner order A → ${reversed ? 'C → B' : 'B → C'} · viewer +Z`,
      result.ok ? `front faces viewer: ${result.value}` : result.note,
      `front faces viewer: ${!reversed}`);
  };
  slider(controlsBar, 'reverse corners', { min: 0, max: 1, step: 1, value: reversed }, value => { reversed = value; update(); });
  update();
};
