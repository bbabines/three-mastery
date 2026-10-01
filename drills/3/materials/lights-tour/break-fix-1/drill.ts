import { Material, MeshLambertMaterial, RectAreaLight } from 'three';
export type Ceiling = { light: RectAreaLight; surface: Material };
export function ceilingPanel(width: number, height: number): Ceiling {
 const light=new RectAreaLight(0xffffff,5,width,height); light.position.set(0,2,0); light.lookAt(0,0,0);
 return {light,surface:new MeshLambertMaterial({color:'#b5824c'})};
}
