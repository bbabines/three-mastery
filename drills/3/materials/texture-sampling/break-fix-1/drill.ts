import {LinearMipmapLinearFilter,NearestFilter,Texture} from 'three';
export function distantTile(texture:Texture):Texture {
 texture.generateMipmaps=false;texture.minFilter=NearestFilter;return texture;
}
