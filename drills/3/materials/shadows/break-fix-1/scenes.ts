import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {fitProductShadow} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container,renderer})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const sample=new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65;scene.add(mesh);
 const key=new THREE.DirectionalLight();key.position.set(1,3,2);scene.add(key);renderer.shadowMap.enabled=true;mesh.castShadow=true;
 const result=attempt('fitProductShadow',()=>fitProductShadow(key,2));
 overlay(container,'readout').textContent=result.ok ? `shadow width: ${result.value.shadow.camera.right-result.value.shadow.camera.left}\nmap width: ${result.value.shadow.mapSize.x}` : result.note;
};
