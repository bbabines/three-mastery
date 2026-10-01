import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { blinnHighlight } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .5, 0);
 const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
 const object = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6, 32, 16), sample);
 object.position.y = .6; scene.add(object);

 const readout = overlay(container, 'readout');
 const result = attempt('blinnHighlight', () => blinnHighlight(new THREE.Vector3(0,1,0), new THREE.Vector3(0,1,0), new THREE.Vector3(1,1,0), 16));
 if (result.ok) sample.color.setScalar(result.value);
 readout.textContent = result.ok ? `view-dependent highlight: ${result.value.toFixed(3)}` : result.note;
};
