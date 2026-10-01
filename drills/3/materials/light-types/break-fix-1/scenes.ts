import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {pointIllumination} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container,renderer})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const sample=new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65;scene.add(mesh);

 const result=attempt('pointIllumination',()=>pointIllumination(400,4));
 overlay(container,'readout').textContent=result.ok ? `far-wall illuminance: ${result.value.toFixed(2)}` : result.note;
};
