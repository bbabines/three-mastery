import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { injectEmissivePulse } from './drill';
export const preview: SceneSetup = ({scene,camera,controls,container}) => {
 camera.position.set(0,1.5,3); controls.target.set(0,.6,0);
 const material=new THREE.MeshStandardMaterial({color:'#305080'});
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(.65,32,16),material); sphere.position.y=.65; scene.add(sphere);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const result=attempt('injectEmissivePulse',()=>injectEmissivePulse(material,.25));
 overlay(container,'readout').textContent=result.ok ? 'standard lighting preserved\nemissive pulse added' : result.note;
};
