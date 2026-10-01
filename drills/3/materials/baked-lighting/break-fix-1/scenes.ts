import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {attachCreviceAo} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container,renderer})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const sample=new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65;scene.add(mesh);
 const ao=new THREE.DataTexture(new Uint8Array([140,140,140,255]),1,1);ao.needsUpdate=true;mesh.geometry.setAttribute('uv1',mesh.geometry.getAttribute('uv').clone());
 const result=attempt('attachCreviceAo',()=>attachCreviceAo(sample,ao));
 overlay(container,'readout').textContent=result.ok ? `AO UV set: ${ao.channel}\nmap connected: ${result.value.aoMap===ao}` : result.note;
};
