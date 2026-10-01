import {attempt,overlay} from '@harness/lesson';import type {SceneSetup} from '@harness/scene';import * as THREE from 'three';import {addPulse} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const base=new THREE.MeshStandardMaterial({color:'#507090',roughness:.4});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.65,32,16),base);mesh.position.y=.65;scene.add(mesh);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const result=attempt('addPulse',()=>addPulse(base,.3));if(result.ok)mesh.material=result.value;
 overlay(container,'readout').textContent=result.ok?`material: ${result.value.type}\noriginal kept: ${result.value===base}`:result.note;
};
