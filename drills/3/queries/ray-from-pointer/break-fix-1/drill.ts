// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function pointerRay(camera: THREE.Camera, clientX: number, clientY: number, rect: {left:number; top:number; width:number; height:number}): THREE.Ray {
  const ndc=new THREE.Vector2(clientX/rect.width*2-1,1-clientY/rect.height*2); const caster=new THREE.Raycaster(); caster.setFromCamera(ndc,camera); return caster.ray.clone();
}
