import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { prepareGlass } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const glass=new THREE.MeshBasicMaterial({color:COLORS.yellow});
  const got=attempt('prepareGlass',()=>prepareGlass(glass,0.4));
  readout.textContent=got.ok?`your glass: opacity ${glass.opacity}, depth test ${glass.depthTest}, depth write ${glass.depthWrite}\nreference: opacity 0.4, depth test true, depth write false`:got.note;
  frameMeter(harness, readout);
};
