import { Camera, Scene, Texture } from 'three';
export type WarmRenderer={initTexture(texture:Texture):void;compileAsync(scene:Scene,camera:Camera):Promise<unknown>};
export async function revealVariant(renderer:WarmRenderer,scene:Scene,camera:Camera,texture:Texture,show:()=>void):Promise<void>{
 show();
 renderer.initTexture(texture);
 await renderer.compileAsync(scene,camera);
}
