import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pickPixel } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  let sync=0, asyncReads=0;
  const got=attempt('pickPixel',()=>pickPixel({readRenderTargetPixels:()=>{sync++;},readRenderTargetPixelsAsync:async(_target,_x,_y,_w,_h,buffer)=>{asyncReads++; buffer.set([4,5,6,255]); return buffer;}},new THREE.WebGLRenderTarget(8,8),1,1));
  readout.textContent='Waiting for one ID pixel…';
  if(got.ok) void got.value.then((pixel)=>{readout.dataset.base=`your reads: sync ${sync}, async ${asyncReads}\nID pixel: ${Array.from(pixel).join(', ')}\nreference: sync 0, async 1`;});
  else readout.dataset.base=got.note;
  frameMeter(harness, readout);
};
