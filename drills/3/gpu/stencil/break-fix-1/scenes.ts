import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { maskedTarget } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const target=new THREE.WebGLRenderTarget(100,100), material=new THREE.MeshBasicMaterial();
  const got=attempt('maskedTarget',()=>maskedTarget(target,material,4,3));
  readout.textContent=got.ok?`your target: samples ${target.samples}, stencil ${target.stencilBuffer}\nyour writer: ref ${material.stencilRef}, replace ${material.stencilZPass===THREE.ReplaceStencilOp}\nreference: samples 4, stencil true, ref 3, replace true`:got.note;
  frameMeter(harness, readout);
};
