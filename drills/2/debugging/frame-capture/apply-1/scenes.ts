import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { targetRedByte } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const target=new THREE.WebGLRenderTarget(8,8); const fake={readRenderTargetPixels:(_target:THREE.WebGLRenderTarget,_x:number,_y:number,_w:number,_h:number,pixel:Uint8Array)=>pixel.set([48,2,1,255])} as unknown as Pick<THREE.WebGLRenderer,"readRenderTargetPixels">;
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const result = attempt('targetRedByte', () => targetRedByte(fake,target,3,4));
    readout.textContent = (result.ok ? `target red byte: ${result.value}` : result.note);
  });
};
