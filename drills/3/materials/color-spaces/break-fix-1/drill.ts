import { SRGBColorSpace, Texture } from 'three';
export function markMaps(color: Texture, normal: Texture): {color:Texture;normal:Texture} {
 color.colorSpace=SRGBColorSpace; normal.colorSpace=SRGBColorSpace;
 return {color,normal};
}
