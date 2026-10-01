import {DirectionalLight} from 'three';
export function fitProductShadow(light:DirectionalLight,span:number):DirectionalLight {
 const h=span/2;light.shadow.camera.left=-h;light.shadow.camera.right=h;light.shadow.camera.top=h;light.shadow.camera.bottom=-h;light.shadow.camera.updateProjectionMatrix();return light;
}
