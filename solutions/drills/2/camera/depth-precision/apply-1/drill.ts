// Reference answer for drills/2/camera/depth-precision/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function nearPlaneGain(viewDepth: number, oldNear: number, newNear: number, far: number): Answer<number> {
  const depth=(near:number,d:number)=>new THREE.Vector3(0,0,-d).applyMatrix4(new THREE.PerspectiveCamera(60,1,near,far).projectionMatrix).z;
  return Math.abs(depth(newNear,viewDepth+0.01)-depth(newNear,viewDepth)) / Math.abs(depth(oldNear,viewDepth+0.01)-depth(oldNear,viewDepth));
}
