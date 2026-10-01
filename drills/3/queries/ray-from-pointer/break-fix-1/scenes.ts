import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pointerRay } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  const c=new THREE.PerspectiveCamera(60,1,0.1,100); c.position.z=5; c.updateMatrixWorld();
  const got=attempt('pointerRay',()=>pointerRay(c,400,250,{left:100,top:50,width:600,height:400}));
  const caster=new THREE.Raycaster(); caster.setFromCamera(new THREE.Vector2(0,0),c);
  const want=caster.ray;
  readout.textContent=got.ok?`your result: ${JSON.stringify(got.value)?.slice(0,100)}\nreference: ${JSON.stringify(want)?.slice(0,100)}`:got.note;
};
