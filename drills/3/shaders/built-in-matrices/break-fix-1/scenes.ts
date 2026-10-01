import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {worldNormal} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const material=new THREE.MeshBasicMaterial({color:'#a765a2'});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),material);mesh.position.y=.6;scene.add(mesh);

 const result=attempt('worldNormal',()=>worldNormal(new THREE.Vector3(0,1,0),new THREE.Matrix4().makeRotationZ(.5),new THREE.Matrix4().makeRotationX(.8)));
 overlay(container,'readout').textContent=result.ok ? `world normal: ${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}, ${result.value.z.toFixed(2)}` : result.note;
};
