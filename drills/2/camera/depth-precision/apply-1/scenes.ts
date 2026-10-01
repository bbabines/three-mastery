import { attempt, COLORS, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { nearPlaneGain } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 2.5, 7);
  controls.target.set(0, 0.7, 0);
  const rail = line(COLORS.gray);
  const nearMark = new THREE.Mesh(new THREE.SphereGeometry(0.13), new THREE.MeshBasicMaterial({ color: COLORS.blue }));
  const farMark = new THREE.Mesh(new THREE.SphereGeometry(0.13), new THREE.MeshBasicMaterial({ color: COLORS.green }));
  scene.add(rail, nearMark, farMark);
  setLine(rail, new THREE.Vector3(-2, 0.7, 0), new THREE.Vector3(2, 0.7, 0));
  nearMark.position.set(-1.5, 0.7, 0); farMark.position.set(1.5, 0.7, 0);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Moving near outward separates distant depths');
  let newNear = 0.5;
  const gap = (near: number) => {
    const lens = new THREE.PerspectiveCamera(60, 1, near, 1000);
    const at = (d: number) => (new THREE.Vector3(0, 0, -d).project(lens).z + 1) / 2;
    return at(100.01) - at(100);
  };
  const update = () => {
    const expected = gap(newNear) / gap(0.01);
    const result = attempt('nearPlaneGain', () => nearPlaneGain(100, 0.01, newNear, 1000));
    show(`surface at 100 · old near 0.01 · new near ${newNear.toFixed(2)}`,
      result.ok ? `depth separation ×${result.value.toFixed(1)}` : result.note,
      `depth separation ×${expected.toFixed(1)}`);
  };
  slider(controlsBar, 'new near', { min: 0.1, max: 2, step: 0.1, value: newNear }, value => { newNear = value; update(); });
  update();
};
