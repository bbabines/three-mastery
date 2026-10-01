import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { perforatedPanel } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  const pixels = new Uint8Array(8 * 8 * 4);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const i = (y * 8 + x) * 4;
    const solid = (x + y) % 2 === 0 ? 255 : 0;
    pixels.set([255, solid, 255, 255], i);
  }
  // three.js alphaMap samples green, so each dark checker cell is a real hole.
  const mask = new THREE.DataTexture(pixels, 8, 8, THREE.RGBAFormat);
  mask.magFilter = THREE.NearestFilter;
  mask.minFilter = THREE.NearestFilter;
  mask.needsUpdate = true;
  const result = attempt('perforatedPanel', () => perforatedPanel(mask));
  if (!result.ok) { overlay(container, 'readout').textContent = result.note; return; }
  const front = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.4), result.value);
  front.position.set(-0.65, 0.7, 0);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.4), result.value);
  back.rotation.y = Math.PI;
  back.position.set(0.65, 0.7, 0);
  scene.add(front, back);
  const backing = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), new THREE.MeshBasicMaterial({ color: '#263c59' }));
  backing.position.set(0, 0.7, -0.08);
  scene.add(backing);
  overlay(container, 'readout').textContent =
    `Left: front of perforated panel · right: its back\nBack visible: ${result.value.side === THREE.DoubleSide}\nDepth write: ${result.value.depthWrite}`;
};
