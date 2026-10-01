import {attempt,overlay} from '@harness/lesson';
import type {SceneSetup} from '@harness/scene';
import * as THREE from 'three';
import {circleMask} from './drill';
export const preview: SceneSetup = ({scene,camera,controls,container}) => {
 camera.position.set(0,1.2,3); controls.target.set(0,.4,0);
 const plane=new THREE.Mesh<THREE.PlaneGeometry,THREE.Material>(new THREE.PlaneGeometry(1.5,1.5),new THREE.MeshBasicMaterial({color:'#666666'})); plane.position.y=.6; scene.add(plane);
 const result=attempt('circleMask',()=>circleMask());
 if(result.ok) plane.material=result.value;
 overlay(container,'readout').textContent=result.ok ? 'shader returned\nwatch the plane' : result.note;
};
