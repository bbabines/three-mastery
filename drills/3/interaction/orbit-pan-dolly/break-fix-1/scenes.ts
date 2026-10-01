import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { focusView } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  const orbit={target:new THREE.Vector3()};
  const got=attempt('focusView',()=>focusView(camera,orbit,new THREE.Vector3(2,1,0),4));
  readout.textContent=got.ok?`orbit target: ${orbit.target.toArray().map(n=>n.toFixed(1)).join(', ')}\nreference: 2.0, 1.0, 0.0`:got.note;
};
