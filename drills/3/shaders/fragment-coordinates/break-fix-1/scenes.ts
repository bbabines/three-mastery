import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {vignetteRadius} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const material=new THREE.MeshBasicMaterial({color:'#a765a2'});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),material);mesh.position.y=.6;scene.add(mesh);

 const result=attempt('vignetteRadius',()=>vignetteRadius(new THREE.Vector2(200,100),new THREE.Vector2(200,100),2));
 overlay(container,'readout').textContent=result.ok ? `vignette center distance: ${result.value.toFixed(3)}` : result.note;
};
