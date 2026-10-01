import { Vector3 } from 'three';
export function matteLight(normal:Vector3,toLight:Vector3,toView:Vector3):number {
 return Math.max(0,normal.clone().normalize().dot(toLight.clone().normalize())) * Math.max(0,normal.clone().normalize().dot(toView.clone().normalize()));
}
