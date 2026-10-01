import {LinearMipmapLinearFilter,NearestFilter,Texture} from 'three';
export function distantTile(texture:Texture):Texture {
 texture.generateMipmaps=true;texture.minFilter=LinearMipmapLinearFilter;return texture;
}
