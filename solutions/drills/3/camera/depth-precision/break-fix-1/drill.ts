// Reference repair for drills/3/camera/depth-precision/break-fix-1.
import * as THREE from 'three';

export function depthBufferValue(near: number, far: number, viewDepth: number): number {
  const camera=new THREE.PerspectiveCamera(60,1,near,far); return (new THREE.Vector3(0,0,-viewDepth).applyMatrix4(camera.projectionMatrix).z+1)/2;
}
