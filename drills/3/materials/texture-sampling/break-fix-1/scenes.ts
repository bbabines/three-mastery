import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {distantTile} from './drill';
export const preview:SceneSetup=({scene,camera,controls,container,renderer})=>{
 camera.position.set(0,1.5,3);controls.target.set(0,.6,0);
 const sample=new THREE.MeshStandardMaterial({color:'#b5824c'});
 const mesh=new THREE.Mesh<THREE.SphereGeometry,THREE.Material>(new THREE.SphereGeometry(.6,32,16),sample);
 mesh.position.y=.65;scene.add(mesh);
 const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const ctx=canvas.getContext('2d')!;for(let y=0;y<8;y++)for(let x=0;x<8;x++){ctx.fillStyle=(x+y)%2?'#eee':'#222';ctx.fillRect(x*8,y*8,8,8)}const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(8,8);sample.map=tex;
 const result=attempt('distantTile',()=>distantTile(tex));
 overlay(container,'readout').textContent=result.ok ? `mipmaps: ${result.value.generateMipmaps}\nfilter: ${result.value.minFilter}` : result.note;
};
