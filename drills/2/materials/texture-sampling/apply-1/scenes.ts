import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { packedTiledSurface } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .5, 0);
 const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
 const object = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6, 32, 16), sample);
 object.position.y = .6; scene.add(object);
 const orm = new THREE.DataTexture(new Uint8Array([255, 160, 140, 255]), 1, 1); orm.needsUpdate = true;
 const readout = overlay(container, 'readout');
 const result = attempt('packedTiledSurface', () => packedTiledSurface(sample, orm, 8));
 readout.textContent = result.ok ? `one packed map: ${sample.roughnessMap === sample.metalnessMap}\nmipmaps: ${orm.generateMipmaps}\nanisotropy: ${orm.anisotropy}` : result.note;
};
