import { Material, MeshStandardMaterial, RectAreaLight } from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
export type Ceiling = { light: RectAreaLight; surface: Material };
export function ceilingPanel(width: number, height: number): Ceiling {
 RectAreaLightUniformsLib.init();
 const light=new RectAreaLight(0xffffff,5,width,height); light.position.set(0,2,0);
 light.lookAt(0,0,0);
 return {light,surface:new MeshStandardMaterial({color:'#b5824c',roughness:.6})};
}
