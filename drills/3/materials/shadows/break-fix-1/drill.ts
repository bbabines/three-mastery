import {DirectionalLight} from 'three';
export function fitProductShadow(light:DirectionalLight,span:number):DirectionalLight {
 light.shadow.mapSize.set(4096,4096);return light;
}
