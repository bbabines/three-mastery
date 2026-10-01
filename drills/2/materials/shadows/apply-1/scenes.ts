import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { hybridFloor } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .5, 0);
 const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
 const object = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6, 32, 16), sample);
 object.position.y = .6; scene.add(object);
 object.castShadow = true;
 renderer.shadowMap.enabled = true;
 const floorGeometry = new THREE.PlaneGeometry(2, 2); floorGeometry.setAttribute('uv1', floorGeometry.getAttribute('uv').clone()); const floor = new THREE.Mesh(floorGeometry, sample); floor.rotation.x = -Math.PI / 2; const ao = new THREE.DataTexture(new Uint8Array([180, 180, 180, 255]), 1, 1); ao.needsUpdate = true; const key = new THREE.DirectionalLight(); key.position.set(1, 3, 2); scene.add(floor,key);
 const readout = overlay(container, 'readout');
 const result = attempt('hybridFloor', () => hybridFloor(floor, sample, ao, key));
 readout.textContent = result.ok ? `floor receives shadow: ${floor.receiveShadow}\nAO uses UV set: ${ao.channel}` : result.note;
};
