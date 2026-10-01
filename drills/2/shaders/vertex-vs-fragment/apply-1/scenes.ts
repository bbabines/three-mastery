import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { shaderRuns } from './drill';
export const preview: SceneSetup = ({scene,camera,controls,container}) => {
 camera.position.set(0,1.5,3); controls.target.set(0,.5,0);
 for (let i=0;i<3;i++) { const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({color:'#a76b41',transparent:true,opacity:.5})); m.position.set(0,.5,i*.05); scene.add(m); }
 const result=attempt('shaderRuns',()=>shaderRuns(240,10000,2,3,2));
 overlay(container,'readout').textContent=result.ok ? `vertex: ${result.value.vertex}\nfragment: ${result.value.fragment}` : result.note;
};
