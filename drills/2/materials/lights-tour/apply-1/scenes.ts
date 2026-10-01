import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { studioLights } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .5, 0);
 const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
 const object = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6, 32, 16), sample);
 object.position.y = .6; scene.add(object);

 const readout = overlay(container, 'readout');
 const result = attempt('studioLights', () => studioLights(1.5, 2, 450));
 if (result.ok) { scene.add(result.value.softbox, result.value.fill); object.material = result.value.surface; }
 readout.textContent = result.ok ? `softbox: ${result.value.softbox.width} × ${result.value.softbox.height}\npoint power: ${result.value.fill.power} lm` : result.note;
};
