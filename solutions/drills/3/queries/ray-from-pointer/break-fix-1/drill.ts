// Reference repair for drills/3/queries/ray-from-pointer/break-fix-1.
import * as THREE from 'three';

export function pointerRay(camera: THREE.Camera, clientX: number, clientY: number, rect: {left:number; top:number; width:number; height:number}): THREE.Ray {
  const ndc=new THREE.Vector2((clientX-rect.left)/rect.width*2-1,1-(clientY-rect.top)/rect.height*2); const caster=new THREE.Raycaster(); caster.setFromCamera(ndc,camera); return caster.ray.clone();
}
