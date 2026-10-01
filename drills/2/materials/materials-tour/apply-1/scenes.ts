import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { unlitCutout } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .5, 0);
 const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
 const object = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6, 32, 16), sample);
 object.position.y = .6; scene.add(object);

 const readout = overlay(container, 'readout');
 const mask = new THREE.DataTexture(new Uint8Array([0,0,0,255, 255,255,255,255, 255,255,255,255, 0,0,0,255]), 2, 2);
 mask.needsUpdate = true;
 const result = attempt('unlitCutout', () => unlitCutout("#d87335", mask));
 if (result.ok) object.material = result.value;
 readout.textContent = result.ok ? `unlit: ${result.value.isMeshBasicMaterial}\nfront faces only: ${result.value.side === THREE.FrontSide}` : result.note;
};
