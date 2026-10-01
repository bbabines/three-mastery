import { NoColorSpace, SRGBColorSpace, Texture } from 'three';
export function markMaps(color: Texture, normal: Texture): {color:Texture;normal:Texture} {
 color.colorSpace=SRGBColorSpace; normal.colorSpace=NoColorSpace;
 return {color,normal};
}
