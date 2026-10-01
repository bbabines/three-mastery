import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {chromeStage} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container,renderer})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const sample=new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65;scene.add(mesh);
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#90b7de';ctx.fillRect(0,0,256,128);const light=new THREE.CanvasTexture(canvas);light.mapping=THREE.EquirectangularReflectionMapping;const back=new THREE.CanvasTexture(canvas);back.mapping=THREE.EquirectangularReflectionMapping;
 const result=attempt('chromeStage',()=>chromeStage(scene,sample,light,back));
 overlay(container,'readout').textContent=result.ok ? `environment: ${scene.environment===light?'set':'missing'}\nbackdrop: ${scene.background===back?'set':'missing'}` : result.note;
};
