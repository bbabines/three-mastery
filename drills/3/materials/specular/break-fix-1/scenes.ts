import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { glint } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
 camera.position.set(0, 1.5, 3); controls.target.set(0, .6, 0);
 const sample = new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65; scene.add(mesh);

 const result=attempt('glint',()=>glint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,1,0),new THREE.Vector3(2,1,0),16));
 const readout=overlay(container,'readout');
 readout.textContent=result.ok ? (sample.color.setScalar(result.value), `side-view glint: ${result.value.toFixed(3)}`) : result.note;
};
