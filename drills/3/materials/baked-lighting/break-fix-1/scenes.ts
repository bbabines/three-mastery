import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { attachCreviceAo } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const geometry = new THREE.PlaneGeometry(1.8, 1.2);
  const uv1 = geometry.getAttribute('uv').clone();
  for (let i = 0; i < uv1.count; i++) uv1.setX(i, 1 - uv1.getX(i));
  geometry.setAttribute('uv1', uv1);
  const sample = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 });
  const panel = new THREE.Mesh(geometry, sample);
  panel.position.y = 0.6;
  scene.add(panel);
  const marker = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.2), new THREE.MeshBasicMaterial({ color: '#e36f68' }));
  marker.position.set(0.95, 0.6, 0.01);
  scene.add(marker);
  const ao = new THREE.DataTexture(new Uint8Array([25, 25, 25, 255, 255, 255, 255, 255]), 2, 1, THREE.RGBAFormat);
  ao.magFilter = THREE.NearestFilter;
  ao.minFilter = THREE.NearestFilter;
  ao.needsUpdate = true;
  const result = attempt('attachCreviceAo', () => attachCreviceAo(sample, ao));
  overlay(container, 'readout').textContent = result.ok
    ? `Crevice marker: right edge\nDark AO patch: ${ao.channel === 1 ? 'right' : 'left'}\nColor UVs and AO UVs point to opposite halves.`
    : result.note;
};
