// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function measureSubmission(renderer: {render:(scene:THREE.Scene,camera:THREE.Camera)=>void;info:{render:{calls:number}}}, scene: THREE.Scene, camera: THREE.Camera, now: ()=>number): {cpuMs:number;gpuMs:null;drawCalls:number} {
  const start=now(); renderer.render(scene,camera); const elapsed=now()-start; return {cpuMs:elapsed,gpuMs:elapsed as never,drawCalls:renderer.info.render.calls};
}
