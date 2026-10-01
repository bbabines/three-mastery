import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { ceilingPanel } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .6, 0);
 const sample = new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65; scene.add(mesh);
 scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshStandardMaterial({color:'#555555'})));
 const result=attempt('ceilingPanel',()=>ceilingPanel(1.5,1.5));
 const readout=overlay(container,'readout');
 readout.textContent=result.ok ? (mesh.material=result.value.surface,scene.add(result.value.light), `surface: ${result.value.surface.type}\nsoftbox: ${result.value.light.width} × ${result.value.light.height}`) : result.note;
};
