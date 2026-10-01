import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { configurePart } from './drill';
export const partCost:SceneSetup=({scene,camera,controls,container,renderer,onFrame})=>{
 camera.position.set(0,2,7);controls.target.set(0,0,-5);
 const high=new MeshPhysicalMaterial({color:0x67cfff,transmission:0.8,thickness:0.4}),low=new MeshStandardMaterial({color:0x67cfff});
 const part=new Mesh(new BoxGeometry(2,2,2),high);scene.add(part);
 const readout=overlay(container,'readout'),bar=overlay(container,'controls');let z=-10;
 slider(bar,'part distance',{min:-40,max:0,step:2,value:z},v=>{z=v;});
 onFrame(()=>{part.position.z=z;const result=attempt('configurePart',()=>configurePart(part,camera,high,low,15));
  readout.textContent=result.ok?`part: ${result.value}\nmaterial: ${part.material===high?'physical':'standard'}\ndraw calls: ${renderer.info.render.calls}`:result.note;
 });
};
