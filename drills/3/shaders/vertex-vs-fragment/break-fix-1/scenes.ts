import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {shaderRuns} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const material=new THREE.MeshBasicMaterial({color:'#a765a2'});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),material);mesh.position.y=.6;scene.add(mesh);

 const result=attempt('shaderRuns',()=>shaderRuns(200,1000,2,3,2));
 overlay(container,'readout').textContent=result.ok ? `vertex runs: ${result.value.vertex}\nfragment runs: ${result.value.fragment}` : result.note;
};
