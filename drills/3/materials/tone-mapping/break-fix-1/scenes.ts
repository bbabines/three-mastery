import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { brandTone } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .6, 0);
 const sample = new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65; scene.add(mesh);
 const state={toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1};
 const result=attempt('brandTone',()=>brandTone(state,1.2));
 const readout=overlay(container,'readout');
 readout.textContent=result.ok ? (renderer.toneMapping=result.value.toneMapping,renderer.toneMappingExposure=result.value.toneMappingExposure, `tone mapping: ${result.value.toneMapping === THREE.NeutralToneMapping ? 'Neutral' : 'ACES'}\nexposure: ${result.value.toneMappingExposure}`) : result.note;
};
