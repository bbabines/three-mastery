import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Color, DataTexture, Mesh, MeshBasicMaterial, PlaneGeometry, RGBAFormat } from 'three';
import { updateVariant } from './drill';
export const variantCycle: SceneSetup=({scene,camera,controls,container,renderer,onFrame})=>{
 camera.position.set(0,1,4);controls.target.set(0,0,0);
 const map=new DataTexture(new Uint8Array([255,0,0,255]),1,1,RGBAFormat);map.needsUpdate=true;
 const material=new MeshBasicMaterial({map});const tile=new Mesh(new PlaneGeometry(2,2),material);scene.add(tile);
 const readout=overlay(container,'readout');const scratch=new Uint8Array(4);let ticks=0,cycles=0,note='';
 onFrame(()=>{ticks++;if(ticks%12===0){cycles++;const result=attempt('updateVariant',()=>updateVariant(material,new Color().setHSL((cycles%20)/20,0.8,0.5),scratch));if(!result.ok)note=result.note;}
  readout.textContent=note||`variant cycles: ${cycles}\nGPU textures: ${renderer.info.memory.textures}\nmap reused: ${material.map===map}`;
 });
};
