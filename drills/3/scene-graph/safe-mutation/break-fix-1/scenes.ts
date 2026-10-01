import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { clearMarked } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  subject.userData.originalMaterial = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const a=new THREE.Object3D(),b=new THREE.Object3D();
  a.userData.highlightHelper=b.userData.highlightHelper=true;
  a.userData.target=b.userData.target=subject;
  scene.add(a,b);
  const got=attempt('clearMarked',()=>clearMarked(scene));
  const want=2;
  readout.textContent=got.ok?`your result: ${JSON.stringify(got.value)?.slice(0,100)}\nreference: ${JSON.stringify(want)?.slice(0,100)}`:got.note;
};
