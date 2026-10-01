import { attempt, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { prepareStudio } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const ambient = scene.children.find(child => child instanceof THREE.HemisphereLight) as THREE.HemisphereLight | undefined;
  if (ambient) ambient.intensity = 0.5;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshStandardMaterial({ color: 0x535b66 }));
  floor.rotation.x = -Math.PI / 2;
  const part = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  part.position.y = 0.7;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), new THREE.MeshBasicMaterial({ color: COLORS.yellow, side: THREE.DoubleSide }));
  label.position.set(0, 0.8, -0.65);
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(2, 5, 3);
  scene.add(floor, part, label, light);
  const result = attempt('prepareStudio', () => prepareStudio(renderer, label, light, part, floor, 2));
  const readout = overlay(container, 'readout');
  readout.textContent = result.ok
    ? `blue part should cast a shadow on the floor
yellow label should show through the part
shadow flags: ${light.castShadow}/${part.castShadow}/${floor.receiveShadow}; label depth test: ${(label.material as THREE.Material).depthTest}`
    : result.note;
  frameMeter(harness, readout);
};
