import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { planFrame } from './drill';
export const idlePlan:SceneSetup=({scene,camera,controls,container,onFrame})=>{
 camera.position.set(2,2,4);controls.target.set(0,0,0);scene.add(new Mesh(new BoxGeometry(),new MeshStandardMaterial({color:0x56b9dd})));
 const readout=overlay(container,'readout'),bar=overlay(container,'controls');let dirty=false,slow=0,requests=0,samples=0,dpr=1.5;
 slider(bar,'slow frames',{min:0,max:4,step:1,value:0},v=>{slow=v;dirty=true;});
 slider(bar,'changed',{min:0,max:1,step:1,value:0},v=>{dirty=!!v;});
 onFrame(()=>{const result=attempt('planFrame',()=>planFrame(dirty,true,dpr,slow,0));if(!result.ok){readout.textContent=result.note;return;}
  samples++;if(result.value.render)requests++;dirty=false;dpr=result.value.dpr;readout.textContent=`harness callbacks: ${samples}\nplanned renders: ${requests}\nDPR: ${dpr}`;
 });
};
