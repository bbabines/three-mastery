import {Vector3} from 'three';
export function readOrm(pixel:Vector3):{ao:number;roughness:number;metalness:number} {
 return {ao:pixel.x,roughness:pixel.y,metalness:pixel.z};
}
