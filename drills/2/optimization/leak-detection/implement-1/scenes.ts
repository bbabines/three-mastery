import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { swapMemoryDelta } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const frameSamples: number[] = [];
  const testScene=new THREE.Scene(); const fakeMemory={geometries:2,textures:1}; const fakeRenderer={info:{memory:fakeMemory},render:()=>{}} as unknown as Pick<THREE.WebGLRenderer,"render"|"info">;
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    if (delta > 0 && delta < 0.2) { frameSamples.push(delta * 1000); if (frameSamples.length > 60) frameSamples.shift(); }
    const result=attempt('swapMemoryDelta',()=>swapMemoryDelta(fakeRenderer,testScene,camera,()=>{},20));
    readout.textContent = (result.ok ? `20 swaps: geometry Δ${result.value.geometries}; texture Δ${result.value.textures}` : result.note) + `\nframe: ${frameSamples.length ? (frameSamples.reduce((a,b)=>a+b,0)/frameSamples.length).toFixed(2) : '—'} ms; draws: ${renderer.info.render.calls}`;
  });
};
