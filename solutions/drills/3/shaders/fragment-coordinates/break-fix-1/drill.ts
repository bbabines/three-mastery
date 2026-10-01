import {Vector2} from 'three';
export function vignetteRadius(device:Vector2,cssSize:Vector2,dpr:number):number {
 return device.clone().divideScalar(dpr).distanceTo(cssSize.clone().multiplyScalar(.5))/cssSize.length();
}
