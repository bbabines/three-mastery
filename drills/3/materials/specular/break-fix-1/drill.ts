import { Vector3 } from 'three';
export function glint(normal:Vector3,toLight:Vector3,toView:Vector3,shininess:number):number {
 const half=toLight.clone().normalize().add(new Vector3(0,0,1)).normalize();
 return Math.max(0,normal.clone().normalize().dot(half)) ** shininess;
}
