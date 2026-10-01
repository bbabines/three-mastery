import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { drawSubmissions } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const got=attempt('drawSubmissions',()=>drawSubmissions([{groups:3,visible:true},{groups:1,visible:true}],2));
  const want=12;
  readout.textContent=got.ok?`your result: ${JSON.stringify(got.value)?.slice(0,100)}\nreference: ${JSON.stringify(want)?.slice(0,100)}`:got.note;
  frameMeter(harness, readout);
};
