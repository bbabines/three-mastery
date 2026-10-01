import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { candidateLeaves } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const root=new THREE.Group(), near=new THREE.Object3D(), far=new THREE.Object3D();
  root.userData.box=new THREE.Box3(new THREE.Vector3(-5,-1,-5),new THREE.Vector3(5,1,1));
  near.name='near leaf'; near.userData.box=new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1));
  far.name='missed leaf'; far.userData.box=new THREE.Box3(new THREE.Vector3(3,-1,-5),new THREE.Vector3(5,1,-3));
  root.add(near,far);
  const got=attempt('candidateLeaves',()=>candidateLeaves(new THREE.Ray(new THREE.Vector3(0,0,5),new THREE.Vector3(0,0,-1)),root));
  readout.textContent=got.ok?`your candidate leaves: ${got.value.map(o=>o.name).join(', ')}\nreference: near leaf`:got.note;
};
