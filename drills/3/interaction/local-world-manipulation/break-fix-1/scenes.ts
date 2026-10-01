import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { moveByWorld } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  const group=new THREE.Group(); group.rotation.y=0.8; group.add(subject); scene.add(group);
  const want=subject.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(1,0,0));
  const got=attempt('moveByWorld',()=>moveByWorld(subject,new THREE.Vector3(1,0,0)));
  readout.textContent=got.ok?`your result: ${JSON.stringify(got.value)?.slice(0,100)}\nreference: ${JSON.stringify(want)?.slice(0,100)}`:got.note;
};
