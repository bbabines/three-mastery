import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { selectableBoxHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  subject.name='selectable part'; subject.userData.selectable=true;
  subject.userData.bounds=new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1));
  marker.name='helper'; marker.userData.bounds=new THREE.Box3(new THREE.Vector3(-1,-1,2),new THREE.Vector3(1,1,3));
  const got=attempt('selectableBoxHit',()=>selectableBoxHit(new THREE.Ray(new THREE.Vector3(0,0,5),new THREE.Vector3(0,0,-1)),[marker,subject]));
  readout.textContent=got.ok?`your pick: ${got.value?.name ?? 'none'}\nreference: selectable part`:got.note;
};
