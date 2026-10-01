import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { DataTexture, Matrix4, MeshBasicMaterial, PlaneGeometry, RGBAFormat, NearestFilter } from 'three';
import { buildCutoutRack } from './drill';
export const cutoutRack: SceneSetup=({scene,camera,controls,container,renderer,onFrame})=>{
 camera.position.set(0,0,7);controls.target.set(0,0,0);
 const pixels=new Uint8Array([255,180,40,255,255,180,40,0,255,180,40,0,255,180,40,255]);
 const texture=new DataTexture(pixels,2,2,RGBAFormat);texture.magFilter=NearestFilter;texture.needsUpdate=true;
 const geometry=new PlaneGeometry(3,3), material=new MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:2});
 const transforms=Array.from({length:12},(_,i)=>new Matrix4().makeTranslation((i%3-1)*0.25,(Math.floor(i/3)-1.5)*0.25,-i*0.035));
 const result=attempt('buildCutoutRack',()=>buildCutoutRack(geometry,material,transforms));
 if(result.ok)scene.add(result.value);
 const readout=overlay(container,'readout');const bar=overlay(container,'controls');let visible=12;
 slider(bar,'visible panels',{min:1,max:12,step:1,value:12},v=>{visible=v;if(result.ok)result.value.count=v;});
 onFrame(()=>{readout.textContent=result.ok?`panels: ${visible}\ndraw calls: ${renderer.info.render.calls}\nblending: ${material.transparent}`:result.note;});
};
