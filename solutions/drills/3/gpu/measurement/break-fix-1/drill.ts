// Reference repair for drills/3/gpu/measurement/break-fix-1.
import * as THREE from 'three';

export function measureSubmission(renderer: {render:(scene:THREE.Scene,camera:THREE.Camera)=>void;info:{render:{calls:number}}}, scene: THREE.Scene, camera: THREE.Camera, now: ()=>number): {cpuMs:number;gpuMs:null;drawCalls:number} {
  const start=now(); renderer.render(scene,camera); return {cpuMs:now()-start,gpuMs:null,drawCalls:renderer.info.render.calls};
}
