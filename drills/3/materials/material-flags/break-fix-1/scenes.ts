import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {perforatedPanel} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container,renderer})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const sample=new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65;scene.add(mesh);
 const mask=new THREE.DataTexture(new Uint8Array([0,0,0,255,255,255,255,255,255,255,255,255,0,0,0,255]),2,2);mask.needsUpdate=true;
 const result=attempt('perforatedPanel',()=>perforatedPanel(mask));
 overlay(container,'readout').textContent=result.ok ? (mesh.material=result.value,`front faces: ${result.value.side===THREE.FrontSide}\ndepth write: ${result.value.depthWrite}`) : result.note;
};
