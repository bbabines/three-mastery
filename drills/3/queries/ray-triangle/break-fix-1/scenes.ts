import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { uvAtHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const got=attempt('uvAtHit',()=>uvAtHit(new THREE.Ray(new THREE.Vector3(0.5,0.5,2),new THREE.Vector3(0,0,-1)),new THREE.Vector3(),new THREE.Vector3(2,0,0),new THREE.Vector3(0,2,0),new THREE.Vector2(),new THREE.Vector2(1,0),new THREE.Vector2(0,1)));
  const want=new THREE.Vector2(0.25,0.25);
  readout.textContent=got.ok?`your result: ${JSON.stringify(got.value)?.slice(0,100)}\nreference: ${JSON.stringify(want)?.slice(0,100)}`:got.note;
};
