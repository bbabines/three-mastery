import { ball, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { captureThumbnail } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const calls: string[] = [];
  try {
    captureThumbnail({setRenderTarget:(target)=>{calls.push(target?'thumbnail':'screen');},render:()=>{calls.push('draw');}},new THREE.Scene(),new THREE.Camera(),new THREE.WebGLRenderTarget(64,64));
    readout.textContent=`your calls: ${calls.join(' → ')}\nreference: thumbnail → draw → screen`;
  } catch(error) { readout.textContent=`captureThumbnail threw: ${String(error)}`; }
  frameMeter(harness, readout);
};
