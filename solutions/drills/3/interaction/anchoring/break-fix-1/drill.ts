// Reference repair for drills/3/interaction/anchoring/break-fix-1.
import * as THREE from 'three';

export function labelState(camera: THREE.Camera, worldPoint: THREE.Vector3, width: number, height: number): {x:number;y:number;visible:boolean} {
  camera.updateWorldMatrix(true,false); const p=worldPoint.clone().project(camera); return {x:(p.x+1)*width/2,y:(1-p.y)*height/2,visible:Math.abs(p.x)<=1&&Math.abs(p.y)<=1&&p.z>=-1&&p.z<=1};
}
