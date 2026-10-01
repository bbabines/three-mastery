import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { variant } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const got=attempt('variant',()=>variant(subject));
  if(got.ok){
    got.value.position.x=1.5;
    scene.add(got.value);
    (got.value.material as THREE.MeshStandardMaterial).color.set(COLORS.red);
    readout.textContent=`original after recoloring copy: #${(subject.material as THREE.MeshStandardMaterial).color.getHexString()}\nreference: original stays blue`;
  } else readout.textContent=got.note;
};
